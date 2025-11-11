
# Gemini Flow Pack

This add-on wires **server-side Gemini 1.5** flows with a safe mock fallback.

## What you get
- **Server wrapper**: `apps/web/lib/ai/geminiClient.ts`
  - Reads `GEMINI_API_KEY`, `GEMINI_MODEL`.
  - If no key is set, it returns a **MOCK** generator (no failures during dev).
- **Schemas/Prompts**: `apps/web/lib/ai/schemas.ts`
  - `SeePlan`, `ReasonPacket`, `RiskCritique` types.
  - `planPrompt`, `reasonPrompt`, `riskPrompt` builders.
- **API routes**
  - `POST /api/ai/plan` → SEE plan JSON (or mock).
  - `POST /api/ai/reason` → reason string.
  - `POST /api/ai/risk` → critique JSON.
- **UI**: `AIConsole.tsx` to try the three flows quickly.

## Install
```bash
# add Google Generative AI SDK
pnpm add @google/generative-ai

# env
printf "\nGEMINI_API_KEY=your-key\nGEMINI_MODEL=gemini-1.5-flash\n" >> .env
printf "\nNEXT_PUBLIC_GEMINI_ENABLED=true\n" >> apps/web/.env.local
```

## Use in UI
Render the console near your Composer area:
```tsx
// apps/web/app/page.tsx (example)
<AIConsole symbol={symbol} scope={scopeData} risk={risk.knobs} plan={plan} />
```

## Notes
- Keep the key **server-side** only. Client calls Next API routes.
- Model defaults to `gemini-1.5-flash`. Swap to `-pro` for deeper reasoning.
