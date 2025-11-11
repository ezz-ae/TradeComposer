
# Deeper Patch
- Risk is now a **shared context**: RiskAdaptor updates global knobs; Executor/Guardrails consume them live.
- **Guardrails panel**: color-coded state for SlipCap/KillGap; TTL readout.
- **Executor**: takes live slip/ttl from Risk knobs; caps slip to rails and flags breaches.
- **Composer presets**: save/load to `localStorage`, import/export JSON, mute/arm all.
- **Prioritize Queue**: mock view that rotates sample items; shows Mode chip, symbol, why, and when.
