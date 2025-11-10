from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Header, HTTPException
import asyncio, time, math

app = FastAPI()

# --- add near top ---
SESSIONS = {}  # demo in-memory

def assert_pro(x_device_lease: str | None, x_role: str | None):
    if x_role != "pro": raise HTTPException(status_code=403, detail="pro role required")
    if not x_device_lease: raise HTTPException(status_code=401, detail="device lease missing")

@app.post("/api/sessions")
def create_session(body: dict):
    sid = body.get("id","demo")
    SESSIONS[sid] = {"id": sid, "symbol": body.get("symbol","BTCUSD"), "started_at": time.time()}
    return SESSIONS[sid]

@app.get("/api/sessions/{sid}/state")
def session_state(sid: str):
    s = SESSIONS.get(sid) or {"id": sid, "symbol": "BTCUSD"}
    # mock regime/conf + last composite error
    return {
        "id": s["id"],
        "symbol": s["symbol"],
        "regime": {"trend": "up", "vol": "normal", "bias": "bullish-pullback"},
        "confidence": 0.72,
        "r": 0.58,  # R(t)
        "metrics": {"mae_60s": 12.4}
    }

@app.post("/api/sessions/{sid}/orders")
def orders_guarded(sid: str, body: dict, x_device_lease: str | None = Header(None), x_role: str | None = Header(None)):
    assert_pro(x_device_lease, x_role)
    # then same logic as above...
    mode = body.get("mode")
    if mode == "force": return {"ok": True, "committed": True, "mode": "force"}
    if mode == "prioritize": return {"ok": True, "queued": True, "mode": "prioritize"}
    if mode == "test": return {"ok": True, "queued": True, "mode": "test", "size_pct": 0.03}
    if mode == "review": return {"ok": True, "review_packet": {"sid": sid}}
    return {"ok": False, "error": "invalid_mode"}

@app.websocket("/ws/sessions/{sid}/state")
async def ws_state(ws: WebSocket, sid: str):
    await ws.accept()
    t0 = time.time()
    try:
        while True:
            t = time.time() - t0
            # tiny synthetic expected vs real
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
