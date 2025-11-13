
# API Reference — v4.5 additions

## AI
- `POST /api/ai/plan` — `{ orgId,userId,mode,symbol,scope }` → `SeePlanZ`
- `POST /api/ai/risk` — same body → `{ killGap, slipCap, positionLimit, notes }`
- `POST /api/ai/orchestrate` — returns plan with merged risk

(See v4.4 reference for exchanges, derivatives, exec, payments.)
