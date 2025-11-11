
# Gemini Strict + Orchestration

This layer enforces **valid JSON** and lets you call
**plan → reason → risk → queue** in one API hit.

## What’s new
- **Zod validation** for SEE Plan and Risk Critique.
- **Auto-repair**: extract JSON from code blocks or first balanced object.
- **/api/ai/orchestrate** route: returns `{ plan, reason, critique }` and enqueues a context snapshot.
- **Client hook + button**: `useAIOrchestrator`, `AIOrchestrateButton`.

## Install
```bash
pnpm add zod
# (Gemini SDK already from Flow Pack) pnpm add @google/generative-ai
```

## Use
```tsx
import AIOrchestrateButton from "@/app/components/AIOrchestrateButton";

<AIOrchestrateButton
  symbol={symbol}
  scope={scopeData}
  risk={risk.knobs}
  mode="prioritize"
  frameIndex={0}
/>
```

## Contract
- **Plan** conforms to `SeePlanZ` (tasks[], levels[] number-coerced).
- **Critique** conforms to `RiskCritiqueZ`.
- **Reason** is a trimmed string (quotes stripped).

On success, the server also **POSTs to /api/queue** with full context.
