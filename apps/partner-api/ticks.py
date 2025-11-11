
import asyncio, math, random, time
from typing import Dict, List, Tuple

class SessionState:
    def __init__(self, symbol: str, seed: int = 42):
        self.symbol = symbol
        self.price = 100.0
        self.vol = 0.25
        self.drift = 0.02
        self.ticks: List[Tuple[float, float]] = []  # (ts, price)
        self.seed = seed
        self.rng = random.Random(seed)

    def step(self):
        # noisy drift with mean reversion
        noise = self.rng.gauss(0, self.vol)
        self.drift += self.rng.uniform(-0.005, 0.005)
        self.drift = max(-0.05, min(0.05, self.drift))
        mean_rev = (100.0 - self.price) * 0.0008
        self.price = max(1e-6, self.price * (1.0 + self.drift*0.001) + noise + mean_rev)
        ts = time.time()
        self.ticks.append((ts, self.price))
        # keep last N seconds ~ 5 minutes @ 4Hz -> 1200 samples
        if len(self.ticks) > 1200: self.ticks = self.ticks[-1200:]

    def last_n(self, n: int) -> List[float]:
        return [p for (_, p) in self.ticks[-n:]]

    def tiny_matcher(self) -> List[float]:
        # Predict next 60 steps using linear extrapolation of EMA + momentum
        xs = self.last_n(120) or [self.price]
        if len(xs) < 5: return [xs[-1]]*60
        # EMA
        alpha = 2/(min(50, len(xs))+1)
        ema = xs[0]
        for v in xs[1:]: ema = alpha*v + (1-alpha)*ema
        # momentum (slope via last 20)
        recent = xs[-20:] if len(xs) >= 20 else xs
        slope = (recent[-1] - recent[0]) / max(1, len(recent)-1)
        # project with gentle decay
        out = []
        p = xs[-1]
        for i in range(60):
            decay = math.exp(-i/80.0)
            p = p + slope*decay*0.8 + (ema - p)*0.02
            out.append(p)
        return out

    def scope_snapshot(self) -> dict:
        hist = self.last_n(60)
        if not hist:
            hist = [self.price]*60
        exp = self.tiny_matcher()
        # Normalize to ±range around zero for the scope (deviations from mid)
        def normalize(series):
            mid = sum(series)/len(series)
            return [ (v-mid) for v in series ]
        real = normalize(hist)
        expected = normalize(exp)
        # crude confidence and R from trend coherence
        trend = (hist[-1] - hist[0])
        vol = (max(hist)-min(hist)) or 1.0
        coherence = max(0.0, min(1.0, 0.5 + 0.5* (trend/vol)))
        r = max(0.1, min(1.2, 0.6 + 0.4*(trend/vol)))
        return {
            "ts": time.time(),
            "expected": expected,
            "real": real,
            "confidence": coherence,
            "r": r
        }

class TickEngine:
    def __init__(self):
        self.sessions: Dict[str, SessionState] = {}
        self._task = None

    def get_or_create(self, sid: str, symbol: str) -> SessionState:
        if sid not in self.sessions:
            self.sessions[sid] = SessionState(symbol, seed=hash(sid) & 0xffffffff)
        return self.sessions[sid]

    async def run(self):
        try:
            while True:
                for s in self.sessions.values():
                    # advance ~4Hz
                    s.step(); s.step(); s.step(); s.step()
                await asyncio.sleep(0.25)
        except asyncio.CancelledError:
            return

ENGINE = TickEngine()
