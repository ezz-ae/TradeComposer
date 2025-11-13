
import os, json
import google.generativeai as genai

GEN_MODEL = os.getenv('GEMINI_MODEL', 'gemini-1.5-flash')
GEN_API_KEY = os.getenv('GEMINI_API_KEY', '')

def _init():
  if GEN_API_KEY:
    genai.configure(api_key=GEN_API_KEY)

SEE_PLAN_Z = {
  "type": "object",
  "properties": {
    "symbol": {"type":"string"},
    "timeframe": {"type":"string"},
    "mode": {"type":"string", "enum": ["coins","tokens","memecoins"]},
    "thesis": {"type":"string"},
    "entries": {"type":"array", "items": {"type":"number"}},
    "targets": {"type":"array", "items": {"type":"number"}},
    "stops": {"type":"array", "items": {"type":"number"}},
    "ladder": {"type":"array", "items": {"type":"object", "properties": {
      "side": {"type":"string", "enum":["bid","ask"]},
      "price": {"type":"number"},
      "size": {"type":"number"}
    }, "required":["side","price","size"]}},
    "risk": {"type":"object", "properties": {
      "killGap": {"type":"number"},
      "slipCap": {"type":"number"},
      "maxDD": {"type":"number"}
    }}
  },
  "required": ["symbol","timeframe","mode","thesis","targets","stops"]
}

def base_prompt(scope, mode, symbol):
  if mode=='coins':
    focus = "Prioritize liquid CEX spot pairs; avoid illiquid traps; balanced risk."
  elif mode=='tokens':
    focus = "DeFi blue-chips across venues; emphasize depth and cross-liquidity routing."
  else:
    focus = "High-volatility memecoins; micro-targets, strict stops, tight slippage caps."
  return f"""You are TradeComposer SEE planner.
Return JSON only that matches the provided schema. No prose.
Symbol={symbol}, Scope={scope}, Mode={mode}.
Focus: {focus}.
Include ladder snapshot (bid/ask levels) that is realistic for the symbol and mode.
"""

def gen_plan(scope:dict, mode:str, symbol:str):
  _init()
  model = genai.GenerativeModel(GEN_MODEL, generation_config={
    "response_mime_type": "application/json",
    "response_schema": SEE_PLAN_Z
  })
  prompt = base_prompt(scope, mode, symbol)
  resp = model.generate_content([prompt])
  return json.loads(resp.text)

def gen_risk(scope:dict, mode:str, symbol:str, context:dict):
  _init()
  model = genai.GenerativeModel(GEN_MODEL, generation_config={
    "response_mime_type": "application/json",
    "response_schema": {
      "type": "object",
      "properties": {
        "killGap": {"type":"number"}, "slipCap": {"type":"number"},
        "positionLimit": {"type":"number"}, "notes": {"type":"string"}
      }, "required": ["killGap","slipCap"]
    }
  })
  prompt = f"""Risk adapter suggestion for {symbol} (mode={mode}).
Use scope + context to tune killGap/slipCap/positionLimit. JSON only.
Scope={scope}
Context={context}
"""
  resp = model.generate_content([prompt])
  return json.loads(resp.text)

def orchestrate(scope:dict, mode:str, symbol:str):
  # Minimal Orchestration: plan -> risk attach
  plan = gen_plan(scope, mode, symbol)
  risk = gen_risk(scope, mode, symbol, {"plan": plan})
  plan["risk"] = {**(plan.get("risk") or {}), **risk}
  return plan
