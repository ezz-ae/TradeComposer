
import time, asyncio
class DynamicQuoter:
    def __init__(self, session, venue):
        self.sess = session; self.venue = venue; self.seq = 0; self.running = False
    async def run(self):
        self.running = True
        while self.running:
            t0 = time.time()
            try:
                book = await self.venue.fetch_orderbook(self.sess.get("symbol","BTC/USDT"))
                pos  = await self.venue.fetch_position(self.sess.get("symbol","BTC/USDT"))
                mid = (book["bid"]+book["ask"])/2
                spread = max(book["ask"]-book["bid"], book["tick"])
                size = max(book["min_size"], book["min_size"]*5)
                bid = round(mid - spread/2, book["precision"])
                ask = round(mid + spread/2, book["precision"])
                intents = [
                    {"id": self._id("B"), "side":"buy",  "price":bid, "size":size, "postOnly":True},
                    {"id": self._id("A"), "side":"sell", "price":ask, "size":size, "postOnly":True}
                ]
                await self.venue.replace_orders(self.sess.get("symbol","BTC/USDT"), intents, ttl_ms=800)
            except Exception:
                pass
            await asyncio.sleep(max(0, 1.0 - (time.time()-t0)))
    def _id(self, s): self.seq+=1; return f"{self.sess.get('id','sess')}-{s}-{self.seq}"
