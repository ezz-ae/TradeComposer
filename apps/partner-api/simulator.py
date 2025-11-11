
from dataclasses import dataclass
from typing import List

@dataclass
class LadderLevel:
  side: str
  price: float
  size: float

def simulate_market_order(side: str, amount: float, ladder: List[LadderLevel], slip_bps: float=8.0):
  remaining = amount; cost = 0.0; executed = 0.0
  lvls = sorted(ladder, key=lambda x: x.price, reverse=(side=='buy'))
  for lvl in lvls:
    if (side=='buy' and lvl.side!='ask') or (side=='sell' and lvl.side!='bid'): continue
    take = min(remaining, lvl.size)
    if take <= 0: continue
    px = lvl.price * (1 + (slip_bps/10000.0) * (1 if side=='buy' else -1))
    cost += px * take; executed += take; remaining -= take
    if remaining <= 0: break
  avg = cost / executed if executed>0 else 0.0
  return {'filled': executed, 'avgPx': avg, 'slipBps': slip_bps, 'notFilled': max(remaining, 0.0)}
