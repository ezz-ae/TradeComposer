
import numpy as np
from collections import deque
class Recorder:
    def __init__(self, win_secs=30):
        self.win = deque(maxlen=win_secs*10)
        self.embeddings = []
    def ingest(self, tick): self.win.append(tick)
    def fingerprint(self):
        if len(self.win)<10: return None
        arr = np.array([t['price'] for t in self.win][-100:])
        v = np.diff(arr)
        mean = float(v.mean()) if v.size else 0.0
        std = float(v.std()) if v.size else 0.0
        drift = float((arr[-1]-arr[0])) if arr.size else 0.0
        z = np.array([mean, std, drift])
        self.embeddings.append(z)
        return z
