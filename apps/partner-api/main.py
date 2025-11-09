
from fastapi import FastAPI
from pydantic import BaseModel
from packages.planner.planner import checkchart

app = FastAPI()

class PlanIn(BaseModel):
    symbol: str

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/api/plan")
def plan(inp: PlanIn):
    return checkchart(inp.symbol)

@app.post("/api/sessions/{sid}/orders")
def orders(sid: str, body: dict):
    # body: { mode, intent }
    return {"queued": True, "mode": body.get("mode"), "sid": sid}
