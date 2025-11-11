
# TradeComposer — Project Details

## Product Pillars
1. **Partner, not bot** — it proposes, you compose.
2. **Loss-minimizing defaults** — rails, slip caps, kill gaps; Force is gated.
3. **Explainable by design** — every action has reasons, context, replay.

## Architecture
- **apps/partner-api** (FastAPI): mock feed, quoter sim, queue with context, websockets for scope & queue.
- **apps/web** (Next 14, React 18): Composer, Executor, Risk Adaptor, SEE tray, Journal, Replay.
- **docs/**: operational manuals, forensic specs, Gemini prompts.

## Key Flows
- **Checkchart** → session plan: regime, levels, OP task.
- **SEE (Test/Prioritize/Review/Force)** → queue + audit: context (scope, plan, risk, sim, frameIndex).
- **Export Zip** → `journal.json`, `scope.json`, `plan.json`, `risk.json`, `frames.csv`, `ladder.csv`, `reasons.csv`.

## Guardrails
- **Force disabled** if slipCap > 12 bps or killGap > 30 bps.
- **ForceShield**: reason + explicit risk ack.

## First-User Checklist
See `docs/TODO_FIRST_USER.md`.
