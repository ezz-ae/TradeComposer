
import time, asyncio, uuid
from typing import List, Dict, Any

class QueueBus:
    def __init__(self):
        self.items: List[Dict[str, Any]] = []
        self._subs: List[asyncio.Queue] = []

    def _broadcast(self):
        for q in list(self._subs):
            try: q.put_nowait({"type":"snapshot","items": self.items[-50:]})
            except: pass

    def subscribe(self) -> asyncio.Queue:
        q: asyncio.Queue = asyncio.Queue()
        self._subs.append(q)
        q.put_nowait({"type":"snapshot","items": self.items[-50:]})
        return q

    def unsubscribe(self, q: asyncio.Queue):
        if q in self._subs:
            self._subs.remove(q)

    def enqueue(self, mode: str, symbol: str, why: str, ctx: Dict[str, Any] | None = None):
        it = {
            "id": str(uuid.uuid4())[:8],
            "mode": mode,
            "symbol": symbol,
            "why": why,
            "status": "queued",
            "ts": time.time(),
            "context": ctx or {}
        }
        self.items.append(it)
        self._broadcast()
        return it

    def patch(self, id: str, action: str):
        for it in self.items:
            if it["id"] == id:
                if action == "promote": it["status"] = "priority"
                elif action == "demote": it["status"] = "queued"
                elif action == "cancel": it["status"] = "canceled"
                elif action == "done": it["status"] = "done"
                else: pass
                self._broadcast()
                return it
        return None

BUS = QueueBus()
