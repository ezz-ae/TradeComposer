
# Gemini Integration — v4.5

## Env
- `GEMINI_API_KEY` — set on Cloud Run (Partner-API).
- `GEMINI_MODEL` — default `gemini-1.5-flash` (use `-pro` for deeper reasoning).

## Endpoints
- `POST /api/ai/plan` — schema-validated plan (SeePlanZ).
- `POST /api/ai/risk` — risk adapter suggestions.
- `POST /api/ai/orchestrate` — plan + risk combined.

## Usage
The web `Gemini Task Center` calls these endpoints and renders JSON for the Composer/Executor flow.
Wire `PlanCards` and `PolicyPresetSwitcher` to consume the returned JSON.
