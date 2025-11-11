
# Prioritize Queue + Ladder Heatmap

## Queue API
- `GET /api/queue` → latest items
- `POST /api/queue` → { mode, symbol, why } enqueue
- `PATCH /api/queue/{id}` → { action: promote|demote|cancel|done }
- `WS /ws/queue` → live snapshots

UI wires SEE actions to enqueue with an auto-generated `why` from the current plan.

## Ladder Heatmap
The Quoter Simulator now renders a 10x2 ladder (bids/asks) with depth shading.
- Green = bids, Red = asks
- Intensity ∝ depth at that level
- Shows status, mid, VW price, slip bps, filled%
