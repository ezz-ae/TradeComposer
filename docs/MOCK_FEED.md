
# Mock Tick Feed + Tiny Matcher

- Background engine ticks each session ~4Hz (0.25s loop, 4 steps).
- Each session records last ~5 minutes of ticks.
- `scope_snapshot()` returns:
  - `real`: last 60 normalized deviations
  - `expected`: 60-step projection from EMA + momentum
  - `confidence`: trend/vol coherence
  - `r`: simple return proxy from trend/vol ratio

## Endpoints
- `POST /api/sessions { id, symbol }` → create session
- `GET /api/sessions/{sid}/state` → summary (confidence, r, n_ticks)
- `WS /ws/sessions/{sid}/state` → stream scope snapshots (0.5s)
