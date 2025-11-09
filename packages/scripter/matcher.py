
import numpy as np
class TinyMatcher:
    def predict_60s(self, feats_window):
        prices = np.array([f['price'] for f in feats_window]) if feats_window else np.array([0.0])
        if len(prices)<2: return np.zeros(60), 0.0
        drift = (prices[-1]-prices[0])/max(1,len(prices))
        pred = prices[-1] + np.cumsum(np.full(60, drift))
        conf = min(1.0, abs(drift)*1000.0)
        return pred, conf
