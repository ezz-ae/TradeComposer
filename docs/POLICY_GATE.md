
# Policy Gate

Merges **rails** (slipCap, killGap) with **AI risk critique** to decide if **Force** should be blocked.

## Code
- `apps/web/lib/policy.ts` → `evaluateGate(rails, critique)`
- `apps/web/hooks/usePolicyGate.ts` → fetches `/api/ai/risk` and returns `{ decision, loading, error, refresh }`

Block conditions (default):
- slipCap > 12 bps OR killGap > 30 bps
- any AI `flags[].severity === 'block'`

UI shows:
- `Blocked:` (reasons)
- `Warnings:`
- `Info:`
