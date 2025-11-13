
import os, time, hmac, hashlib, json
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, Request, HTTPException, Depends
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth
from google.cloud import firestore
from .secrets import gsm_store, gsm_access
from .symbols import normalize_symbol
from .derivatives import fetch_positions, set_leverage, place_order
from .simulator import simulate_market_order, LadderLevel
from . import ai as tcai

PROJECT_ID = os.getenv("GCLOUD_PROJECT") or os.getenv("FIREBASE_PROJECT_ID") or os.getenv("GOOGLE_CLOUD_PROJECT")
COINBASE_WEBHOOK_SECRET = os.getenv("COINBASE_COMMERCE_SECRET", "")

if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.Client(project=PROJECT_ID)

async def verify(request: Request):
    authz = request.headers.get("Authorization", "")
    if not authz.startswith("Bearer "): 
        raise HTTPException(401, "missing token")
    token = authz.split(" ", 1)[1]
    try:
        return auth.verify_id_token(token)
    except Exception:
        raise HTTPException(401, "invalid token")

def user_ref(orgId, uid): return db.document(f"orgs/{orgId}/users/{uid}")
def conn_ref(orgId, uid, cid): return db.document(f"orgs/{orgId}/users/{uid}/connections/{cid}")
def payment_ref(orgId, uid, pid): return db.document(f"orgs/{orgId}/users/{uid}/payments/{pid}")

app = FastAPI(title="TradeComposer Partner API v4.5")

class PlanReq(BaseModel):
    orgId: str
    userId: str
    mode: str
    symbol: str
    scope: dict

class TradeReq(BaseModel):
    orgId: str
    userId: str
    connId: str
    side: str
    symbol: str
    amount: float
    reduceOnly: bool = False
    dryRun: bool = False
    ladder: Optional[List[Dict[str, Any]]] = None

class LeverageReq(BaseModel):
    orgId: str
    userId: str
    connId: str
    symbol: str
    leverage: int

# ---- Health ----
@app.get("/healthz")
def healthz():
    return {"ok": True, "project": PROJECT_ID}

# ---- AI endpoints ----
@app.post("/api/ai/plan")
async def ai_plan(req: PlanReq, decoded=Depends(verify)):
    if decoded["uid"] != req.userId: raise HTTPException(403, "forbidden")
    out = tcai.gen_plan(req.scope, req.mode, req.symbol)
    return out

@app.post("/api/ai/risk")
async def ai_risk(req: PlanReq, decoded=Depends(verify)):
    if decoded["uid"] != req.userId: raise HTTPException(403, "forbidden")
    out = tcai.gen_risk(req.scope, req.mode, req.symbol, {})
    return out

@app.post("/api/ai/orchestrate")
async def ai_orchestrate(req: PlanReq, decoded=Depends(verify)):
    if decoded["uid"] != req.userId: raise HTTPException(403, "forbidden")
    out = tcai.orchestrate(req.scope, req.mode, req.symbol)
    return out

# ---- Derivatives & Exec (kept from v4.4) ----
@app.post("/api/deriv/leverage")
async def api_set_leverage(req: LeverageReq, decoded=Depends(verify)):
    if decoded["uid"] != req.userId: raise HTTPException(403, "forbidden")
    doc = conn_ref(req.orgId, req.userId, req.connId).get()
    if not doc.exists: raise HTTPException(404, "conn not found")
    meta = doc.to_dict()
    blob = gsm_access(f"conn-{req.orgId}-{req.userId}-{req.connId}")
    if not blob: raise HTTPException(500, "secrets_missing")
    creds = json.loads(blob)
    sym = normalize_symbol(req.symbol)
    out = await set_leverage(meta["kind"], creds, bool(meta.get("sandbox")), sym, req.leverage)
    return out

@app.get("/api/deriv/positions/{orgId}/{uid}/{connId}")
async def api_positions(orgId: str, uid: str, connId: str, decoded=Depends(verify)):
    if decoded["uid"] != uid: raise HTTPException(403, "forbidden")
    doc = conn_ref(orgId, uid, connId).get()
    if not doc.exists: raise HTTPException(404, "conn not found")
    meta = doc.to_dict()
    blob = gsm_access(f"conn-{orgId}-{uid}-{connId}")
    if not blob: raise HTTPException(500, "secrets_missing")
    creds = json.loads(blob)
    out = await fetch_positions(meta["kind"], creds, bool(meta.get("sandbox")))
    return out

@app.post("/api/exec/place")
async def api_place(req: TradeReq, decoded=Depends(verify)):
    if decoded["uid"] != req.userId: raise HTTPException(403, "forbidden")
    doc = conn_ref(req.orgId, req.userId, req.connId).get()
    if not doc.exists: raise HTTPException(404, "conn not found")
    meta = doc.to_dict()
    blob = gsm_access(f"conn-{req.orgId}-{req.userId}-{req.connId}")
    if not blob: raise HTTPException(500, "secrets_missing")
    creds = json.loads(blob)
    sym = normalize_symbol(req.symbol)
    if req.dryRun:
        ladder = [LadderLevel(**x) for x in (req.ladder or [])]
        sim = simulate_market_order(req.side, req.amount, ladder, slip_bps=8.0)
        return {"dryRun": True, "symbol": sym, "result": sim}
    out = await place_order(meta["kind"], creds, bool(meta.get("sandbox")), sym, req.side, req.amount, reduce_only=req.reduceOnly)
    return out
