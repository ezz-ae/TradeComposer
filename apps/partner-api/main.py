
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Header, HTTPException
from pydantic import BaseModel
import asyncio, time

from . import ticks

app = FastAPI(title="Trade Composer Partner API (mock feed + matcher)")

bg_task = None
@app.on_event("startup")
async def _startup():
    global bg_task
    if bg_task is None:
        loop = asyncio.get_event_loop()
        bg_task = loop.create_task(ticks.ENGINE.run())

@app.on_event("shutdown")
async def _shutdown():
    global bg_task
    if bg_task: bg_task.cancel()

def assert_pro(x_device_lease: str | None, x_role: str | None):
    if x_role != "pro": raise HTTPException(status_code=403, detail="pro role required")
    if not x_device_lease: raise HTTPException(status_code=401, detail="device lease missing")

class PlanIn(BaseModel):
    symbol: str

@app.get("/health")
def health():
    return {"ok": True, "sessions": list(ticks.ENGINE.sessions.keys())}

@app.post("/api/plan")
def plan(inp: PlanIn):
    # simple synthetic levels, unchanged
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
    symbol = body.get("symbol","BTCUSD")
    s = ticks.ENGINE.get_or_create(sid, symbol)
    return {"id": sid, "symbol": s.symbol, "started_at": time.time()}

@app.get("/api/sessions/{sid}/state")
def session_state(sid: str):
    s = ticks.ENGINE.get_or_create(sid, "BTCUSD")
    snap = s.scope_snapshot()
    return {
        "id": sid,
        "symbol": s.symbol,
        "regime": {"trend": "up", "vol": "normal", "bias": "bullish-pullback"},
        "confidence": snap["confidence"],
        "r": snap["r"],
        "metrics": {"n_ticks": len(s.ticks)}
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
    s = ticks.ENGINE.get_or_create(sid, "BTCUSD")
    try:
        while True:
            snap = s.scope_snapshot()
            await ws.send_json(snap)
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        return
