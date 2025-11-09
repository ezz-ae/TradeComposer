
from datetime import datetime
def checkchart(symbol: str, tfs=("H4","H1","M15")) -> dict:
    regime = {"trend":"up","vol":"normal","bias":"bullish-pullback"}
    levels = [{"type":"pd_high","price":67320.0},{"type":"ema200_h1","price":66240.5}]
    tasks = [
      {"id":"AL-1","type":"alert","desc":"Approach EMA200(H1) ±10bps","trigger":{"operator":"within_bps","bps":10,"price":66240.5},"priority":"high","expires":"session_close"},
      {"id":"OP-1","type":"order","desc":"SAR on break of PD High","order":{"intent":"stop_and_reverse","trigger":{"op":">=","price":67320.0},"open":{"side":"buy","size":"risk_1R"},"sl":{"basis":"swing_low","buffer_bps":15},"tp":{"rr":2.0}},"priority":"high"}
    ]
    return {"symbol": symbol, "time_generated": datetime.utcnow().isoformat(), "regime": regime, "levels": levels, "tasks": tasks}
