
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

PROJECT_ID = os.getenv("GCLOUD_PROJECT") or os.getenv("FIREBASE_PROJECT_ID") or os.getenv("GOOGLE_CLOUD_PROJECT")
COINBASE_WEBHOOK_SECRET = os.getenv("COINBASE_COMMERCE_SECRET", "")
COINBASE_ENABLED = os.getenv("COINBASE_ENABLED", "true").lower() == "true"

if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.Client(project=PROJECT_ID)

# ------------ Auth ------------
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

# ------------ Models ------------
class Connection(BaseModel):
    orgId: str
    userId: str
    kind: str   # binance|okx|bybit|wallet|webhook
    label: str
    apiKey: Optional[str] = None
    secret: Optional[str] = None
    password: Optional[str] = None
    sandbox: bool = False

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

class PaymentIntent(BaseModel):
    orgId: str
    userId: str
    amount: float
    currency: str = "USDC"
    chain: str = "polygon"
    provider: str = "coinbase"  # or 'manual'

# ------------ Health ------------
app = FastAPI(title="TradeComposer Partner API v4.4.1")

@app.get("/healthz")
def healthz():
    return {"ok": True, "project": PROJECT_ID}

# ------------ Users ------------
@app.get("/api/users/{orgId}/{uid}")
async def get_user(orgId: str, uid: str, decoded=Depends(verify)):
    if decoded["uid"] != uid: raise HTTPException(403, "forbidden")
    doc = user_ref(orgId, uid).get()
    if not doc.exists:
        user_ref(orgId, uid).set({"uid": uid, "plan":"free", "credits": 0, "createdAt": int(time.time()*1000)})
        return {"uid": uid, "plan":"free", "credits": 0}
    return doc.to_dict()

# ------------ Connections ------------
@app.post("/api/exchanges/link")
async def link_exchange(payload: Connection, decoded=Depends(verify)):
    if decoded["uid"] != payload.userId: raise HTTPException(403, "forbidden")
    conn_id = f"{payload.kind}-{int(time.time()*1000)}"
    if payload.apiKey or payload.secret or payload.password:
        blob = json.dumps({"apiKey": payload.apiKey or "", "secret": payload.secret or "", "password": payload.password or ""})
        ver_name = gsm_store(f"conn-{payload.orgId}-{payload.userId}-{conn_id}", blob)
    else:
        ver_name = None
    conn_ref(payload.orgId, payload.userId, conn_id).set({
        "id": conn_id, "kind": payload.kind, "label": payload.label,
        "gsmVersion": ver_name, "sandbox": payload.sandbox, "createdAt": int(time.time()*1000)
    })
    return {"id": conn_id, "kind": payload.kind, "label": payload.label, "sandbox": payload.sandbox}

@app.get("/api/exchanges/{orgId}/{uid}")
async def list_conns(orgId: str, uid: str, decoded=Depends(verify)):
    if decoded["uid"] != uid: raise HTTPException(403, "forbidden")
    col = db.collection(f"orgs/{orgId}/users/{uid}/connections").stream()
    return [ {"id": d.id, **d.to_dict()} for d in col ]

# ------------ Derivatives ------------
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

# ------------ Execution (live or dry-run) ------------
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

# ------------ Payments → entitlements ------------
def grant_entitlement(orgId: str, uid: str, amount_usd: float):
    ur = user_ref(orgId, uid)
    snap = ur.get()
    data = snap.to_dict() if snap.exists else {"uid": uid, "plan": "free", "credits": 0}
    data["credits"] = float(data.get("credits", 0)) + amount_usd
    if data["credits"] >= 100 and data.get("plan") == "free":
        data["plan"] = "pro"
    ur.set(data, merge=True)
    return data

@app.post("/api/payments/webhook/coinbase")
async def coinbase_webhook(request: Request):
    sig = request.headers.get("X-CC-Webhook-Signature", "")
    raw = await request.body()
    h = hmac.new(bytes(COINBASE_WEBHOOK_SECRET, "utf-8"), raw, hashlib.sha256).hexdigest()
    if not COINBASE_WEBHOOK_SECRET or h != sig:
        raise HTTPException(401, "invalid signature")
    event = json.loads(raw.decode("utf-8"))
    data = event.get("event", {}).get("data", {})
    status = data.get("timeline", [{}])[-1].get("status")
    meta = data.get("metadata", {})
    orgId = meta.get("orgId"); uid = meta.get("userId"); pid = meta.get("paymentId")
    amount_usd = float(meta.get("amountUsd", 0) or 0)
    if orgId and uid and pid:
        payment_ref(orgId, uid, pid).set({ "status": status, "coinbase_id": data.get("id") }, merge=True)
        if status in ("confirmed","resolved"):
            grant_entitlement(orgId, uid, amount_usd or 25.0)
    return {"ok": True}
