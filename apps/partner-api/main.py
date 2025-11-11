
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Header, HTTPException
import asyncio, time, math
from pydantic import BaseModel

app = FastAPI(title="Trade Composer Partner API")

SESSIONS = {}

def assert_pro(x_device_lease: str | None, x_role: str | None):
    if x_role != "pro": raise HTTPException(status_code=403, detail="pro role required")
    if not x_device_lease: raise HTTPException(status_code=401, detail="device lease missing")

class PlanIn(BaseModel):
    symbol: str

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/api/plan")
def plan(inp: PlanIn):
    return {
      "symbol": inp.symbol,
      "regime": {"trend":"up","vol":"normal","bias":"bullish-pullback"},
      "levels": [{"type":"pd_high","price":67320.0},{"type":"ema200_h1","price":66240.5}],
      "tasks": [
        {"id":"AL-1","type":"alert","desc":"Approach EMA200(H1) ±10bps","trigger":{"operator":"within_bps","bps":10,"price":66240.5},"priority":"high","expires":"session_close"},
        {"id":"OP-1","type":"order","desc":"SAR on break of PD High","order":{"intent":"stop_and_reverse","trigger":{"op":">=","price":67320.0},"open":{"side":"buy","size":"risk_1R"},"sl":{"basis":"swing_low","buffer_bps":15},"tp":{"rr":2.0}},"priority":"high"}
      ]
    }

@app.post("/api/sessions")
def create_session(body: dict):
    sid = body.get("id","demo")
    SESSIONS[sid] = {"id": sid, "symbol": body.get("symbol","BTCUSD"), "started_at": time.time()}
    return SESSIONS[sid]

@app.get("/api/sessions/{sid}/state")
def session_state(sid: str):
    s = SESSIONS.get(sid) or {"id": sid, "symbol": "BTCUSD"}
    return {
        "id": s["id"],
        "symbol": s["symbol"],
        "regime": {"trend": "up", "vol": "normal", "bias": "bullish-pullback"},
        "confidence": 0.72,
        "r": 0.58,
        "metrics": {"mae_60s": 12.4}
    }

@app.post("/api/sessions/{sid}/orders")
def orders_guarded(sid: str, body: dict, x_device_lease: str | None = Header(None), x_role: str | None = Header(None)):
    assert_pro(x_device_lease, x_role)
    mode = body.get("mode")
    if mode == "review": return {"ok": True, "review_packet": {"sid": sid, "intent": body.get("intent")}}
    if mode == "test": return {"ok": True, "queued": True, "mode": "test", "size_pct": 0.03}
    if mode == "prioritize": return {"ok": True, "queued": True, "mode": "prioritize"}
    if mode == "force": return {"ok": True, "committed": True, "mode": "force"}
    return {"ok": False, "error": "invalid_mode"}

@app.websocket("/ws/sessions/{sid}/state")
async def ws_state(ws: WebSocket, sid: str):
    await ws.accept()
    t0 = time.time()
    try:
        while True:
            t = time.time() - t0
            expected = [math.sin((t+i)/6.0)*20 for i in range(60)]
            real     = [math.sin((t+i)/6.0)*20 + (0.8 if i<30 else -0.6) for i in range(60)]
            payload = {
                "ts": time.time(),
                "confidence": 0.6 + 0.3*math.sin(t/20.0),
                "r": 0.5 + 0.2*math.sin(t/15.0),
                "expected": expected,
                "real": real
            }
            await ws.send_json(payload)
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        return
