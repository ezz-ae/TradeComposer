
# Operations / Forensics Pack

**Export Zip** bundles a full repro snapshot for support:
- `journal.json` — UI/API events
- `presets.json` — Composer presets
- `env.json` — client API URL
- `scope` — latest expected/real series + confidence, R(t)
- `risk` — current knobs
- `plan` — current task plan
- `sim` — last ladder + VW fill + slippage
- `queue` — active action queue

Use this to compare **Expected vs Real** and ladder context around actions.
