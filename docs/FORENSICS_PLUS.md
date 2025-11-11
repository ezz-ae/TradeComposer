
# Forensics++

This layer makes every action **explainable and exportable**.

## Auto-Reason Generator
- Builds a reason from **symbol, plan OP task, risk knobs (slip/kill), current scope (r, confidence), and frame index**.
- Attached to all actions (SEE/Test/Prioritize/Force).
- On **Force**, the reason is pre-filled in the confirm modal and remains editable.

**Format**
```
BTCUSD FORCE | SAR on break of PD High | slip=8bps | kill=20bps | frame=142 | conf=73% | R=61%
```

## Reason Storage
- Stored to `localStorage` under `tc.reasons.v1` with:
  - `ts, mode, symbol, reason, hash` (FNV-1a hash).

## CSV Export
- Adds to ZIP:
  - `frames.csv` — derived from replay frames (index, ts, r, confidence, expected_last, real_last)
  - `ladder.csv` — last simulator book snapshot (bid/ask, price, qty)
  - `reasons.csv` — all reasons with hash

## Workflow
1. **Simulate** to get ladder.
2. **Checkchart** for a plan.
3. **SEE/Review** → **Test/Prioritize/Force**.
4. **Export Zip** → analyze `*.csv` + JSONs.

## Correlate
- Use `frameIndex` from queue context and the `frames.csv` index to replay the scope for that exact decision.
- Use `hash` from `reasons.csv` to reference commit messages or external tickets.
