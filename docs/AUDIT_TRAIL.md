
# Audit Trail (Depth-in-Depth)

## What is captured
Every SEE/Review action enqueued now includes a **context snapshot**:
- `scope` — expected/real frame at action time
- `risk` — current knobs
- `plan` — active task plan
- `sim` — last ladder + quoter result
- `frameIndex` — replay index to jump directly to that moment

## Inspect & Replay
- Open **Prioritize Queue → Inspect** to view the full context JSON.
- Click **Replay Frame** to jump the on-screen scope to that frame.

## Export
Forensics ZIP already includes scope/risk/plan/sim and queue. This patch makes queue items self-contained.
