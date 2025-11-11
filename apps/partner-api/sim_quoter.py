
import math, random, time
from typing import Dict, List, Tuple

class OrderBook:
    def __init__(self, mid: float, spread_bps: float = 2.0, depth_levels: int = 10, seed: int = 7):
        self.mid = mid
        self.spread_bps = spread_bps
        self.depth_levels = depth_levels
        self.rng = random.Random(seed)

    def snapshot(self):
        # symmetric book with increasing size as we move away from mid
        bid0 = self.mid * (1 - self.spread_bps/10000.0)
        ask0 = self.mid * (1 + self.spread_bps/10000.0)
        bids = []
        asks = []
        px = bid0
        for i in range(self.depth_levels):
            sz = max(0.1, self.rng.uniform(0.2, 1.2) * (i+1)*0.05)
            bids.append((round(px, 2), round(sz, 4)))
            px *= (1 - 0.5/10000.0)  # 0.5 bps step
        px = ask0
        for i in range(self.depth_levels):
            sz = max(0.1, self.rng.uniform(0.2, 1.2) * (i+1)*0.05)
            asks.append((round(px, 2), round(sz, 4)))
            px *= (1 + 0.5/10000.0)
        return { "mid": round(self.mid,2), "bids": bids, "asks": asks }

def simulate_quote(side: str, size_usd: float, slip_cap_bps: float, ttl_ms: int, book: OrderBook):
    snap = book.snapshot()
    target_slip = slip_cap_bps/10000.0
    if side not in ("buy","sell"): return {"ok": False, "error": "bad_side"}

    remaining = size_usd
    fills: List[Tuple[float,float]] = []
    # choose book side
    ladder = snap["asks"] if side=="buy" else snap["bids"]
    worst_px_limit = snap["mid"] * (1 + target_slip) if side=="buy" else snap["mid"] * (1 - target_slip)
    notional_filled = 0.0

    for (px, lotsize) in ladder:
        if (side=="buy" and px > worst_px_limit) or (side=="sell" and px < worst_px_limit):
            break
        px_usd = px
        take = min(remaining, lotsize * px_usd * 1000)  # scale lot size to USD notionally
        if take <= 0: continue
        fills.append((px_usd, take/px_usd))
        notional_filled += take
        remaining -= take
        if remaining <= 1e-6: break

    if not fills:
        return {"ok": True, "status": "no_fill", "mid": snap["mid"], "slip_cap_bps": slip_cap_bps, "ttl_ms": ttl_ms, "side": side, "size_usd": size_usd}

    vw_price = sum(px*q for px,q in fills) / sum(q for _,q in fills)
    slip_bps = (vw_price/snap["mid"] - 1.0) * (10000 if side=="buy" else -10000)
    filled_pct = notional_filled/size_usd
    status = "partial" if remaining>1e-6 else "filled"

    return {
        "ok": True,
        "status": status,
        "mid": snap["mid"],
        "vw_price": round(vw_price, 2),
        "slip_bps": round(slip_bps, 2),
        "filled_pct": round(filled_pct, 3),
        "slip_cap_bps": slip_cap_bps,
        "ttl_ms": ttl_ms,
        "side": side,
        "size_usd": size_usd,
        "book": snap
    }
