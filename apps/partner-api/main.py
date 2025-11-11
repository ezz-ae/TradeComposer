
import os, time, hmac, hashlib, json, asyncio
from typing import Optional, Dict, Any
from fastapi import FastAPI, Request, HTTPException, Depends
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth, credentials
from google.cloud import firestore
from .secrets import gsm_store, gsm_access, kms_encrypt, kms_decrypt
from .exchanges import make_exchange, get_balances, market_buy, market_sell

PROJECT_ID = os.getenv("GCLOUD_PROJECT") or os.getenv("FIREBASE_PROJECT_ID")
COINBASE_WEBHOOK_SECRET = os.getenv("COINBASE_COMMERCE_SECRET", "")

if not firebase_admin._apps:
    try:
        firebase_admin.initializeApp()
    except:
        firebase_admin.initialize_app()

db = firestore.Client(project=PROJECT_ID)

class LinkExchange(BaseModel):
    orgId: str
    userId: str
    kind: str             # binance|okx|bybit
    label: str
    apiKey: str
    secret: str
    password: Optional[str] = None
    sandbox: bool = False

class TradeReq(BaseModel):
    orgId: str
    userId: str
    connId: str
    side: str             # buy|sell
    symbol: str           # e.g., BTC/USDT
    amount: float

async def verify(request: Request):
    authz = request.headers.get("Authorization","")
    if not authz.startswith("Bearer "): raise HTTPException(401, "missing token")
    token = authz.split(" ",1)[1]
    try:
        return auth.verify_id_token(token)
    except Exception:
        raise HTTPException(401, "invalid token")

app = FastAPI(title="TradeComposer Partner API v4.2")

def user_ref(orgId, uid): return db.document(f"orgs/{orgId}/users/{uid}")
def conn_ref(orgId, uid, cid): return db.document(f"orgs/{orgId}/users/{uid}/connections/{cid}")
def payment_ref(orgId, uid, pid): return db.document(f"orgs/{orgId}/users/{uid}/payments/{pid}")

# ---------- Entitlements helper ----------
def grant_entitlement(orgId: str, uid: str, amount_usd: float):
    # Simple: $=> credits add; plan switch if threshold met
    ur = user_ref(orgId, uid)
    snap = ur.get()
    data = snap.to_dict() if snap.exists else {"uid": uid, "plan": "free", "credits": 0}
    data["credits"] = float(data.get("credits", 0)) + amount_usd
    if data["credits"] >= 100 and data.get("plan") == "free":
        data["plan"] = "pro"
    ur.set(data, merge=True)
    return data

# ---------- Link exchange (store secrets in GSM + metadata in Firestore) ----------
@app.post("/api/exchanges/link")
async def link_exchange(payload: LinkExchange, decoded=Depends(verify)):
    if decoded["uid"] != payload.userId: raise HTTPException(403, "forbidden")
    conn_id = f"{payload.kind}-{int(time.time()*1000)}"
    # Encrypt + store in GSM
    secret_blob = json.dumps({"apiKey": payload.apiKey, "secret": payload.secret, "password": payload.password or ""})
    ver_name = gsm_store(f"conn-{payload.orgId}-{payload.userId}-{conn_id}", secret_blob)
    # Store Firestore connection meta (no raw secrets)
    conn_ref(payload.orgId, payload.userId, conn_id).set({
        "id": conn_id, "kind": payload.kind, "label": payload.label,
        "gsmVersion": ver_name, "sandbox": payload.sandbox, "createdAt": int(time.time()*1000)
    })
    return { "id": conn_id, "kind": payload.kind, "label": payload.label, "sandbox": payload.sandbox }

# ---------- List connections ----------
@app.get("/api/exchanges/{orgId}/{uid}")
async def list_conns(orgId: str, uid: str, decoded=Depends(verify)):
    if decoded["uid"] != uid: raise HTTPException(403, "forbidden")
    col = db.collection(f"orgs/{orgId}/users/{uid}/connections").stream()
    return [ { "id": d.id, **d.to_dict() } for d in col ]

# ---------- Balances (decrypt secrets, use CCXT) ----------
@app.get("/api/exchanges/{orgId}/{uid}/{connId}/balances")
async def balances(orgId: str, uid: str, connId: str, decoded=Depends(verify)):
    if decoded["uid"] != uid: raise HTTPException(403, "forbidden")
    doc = conn_ref(orgId, uid, connId).get()
    if not doc.exists: raise HTTPException(404, "not found")
    meta = doc.to_dict()
    blob = gsm_access(f"conn-{orgId}-{uid}-{connId}")
    if not blob: raise HTTPException(500, "secrets_missing")
    s = json.loads(blob)
    ex = make_exchange(meta["kind"], s["apiKey"], s["secret"], s.get("password") or None, sandbox=bool(meta.get("sandbox")))
    # ccxt asyncio support: use .aio or run in thread; simplest: wrap in run_in_executor if needed
    import ccxt.async_support as ccxta
    cls = getattr(ccxta, meta["kind"])
    exa = cls({'apiKey': s['apiKey'], 'secret': s['secret'], 'password': s.get('password') or None, 'enableRateLimit': True})
    if bool(meta.get('sandbox')) and hasattr(exa, 'set_sandbox_mode'): exa.set_sandbox_mode(True)
    try:
        bal = await exa.fetch_balance()
        total = { k:v for k,v in (bal.get('total') or {}).items() if isinstance(v,(int,float)) and v>0 }
        return { "total": total, "raw": bal.get('info') }
    finally:
        await exa.close()

# ---------- Place trade ----------
@app.post("/api/trade/place")
async def place_trade(req: TradeReq, decoded=Depends(verify)):
    if decoded["uid"] != req.userId: raise HTTPException(403, "forbidden")
    doc = conn_ref(req.orgId, req.userId, req.connId).get()
    if not doc.exists: raise HTTPException(404, "conn not found")
    meta = doc.to_dict()
    blob = gsm_access(f"conn-{req.orgId}-{req.userId}-{req.connId}")
    if not blob: raise HTTPException(500, "secrets_missing")
    s = json.loads(blob)
    import ccxt.async_support as ccxta
    cls = getattr(ccxta, meta["kind"])
    exa = cls({'apiKey': s['apiKey'], 'secret': s['secret'], 'password': s.get('password') or None, 'enableRateLimit': True})
    if bool(meta.get('sandbox')) and hasattr(exa, 'set_sandbox_mode'): exa.set_sandbox_mode(True)
    try:
        if req.side=='buy':
            o = await exa.create_market_buy_order(req.symbol, req.amount)
        else:
            o = await exa.create_market_sell_order(req.symbol, req.amount)
        return { "ok": True, "order": o }
    finally:
        await exa.close()

# ---------- Coinbase webhook → entitlements ----------
@app.post("/api/payments/webhook/coinbase")
async def coinbase_webhook(request: Request):
    sig = request.headers.get("X-CC-Webhook-Signature","")
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
            grant_entitlement(orgId, uid, amount_usd or 25.0)  # default credit if not provided
    return {"ok": True}
