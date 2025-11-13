
# Prompts & Schema — v4.5

**SeePlanZ schema** (server-enforced via Gemini response schema):
- `symbol`, `timeframe`, `mode`, `thesis`
- `entries[]`, `targets[]`, `stops[]`
- `ladder[]` of `{side,price,size}`
- `risk`: `{ killGap, slipCap, maxDD }`

**Prompt strategy**
- Mode-specific focus (coins/tokens/memecoins)
- Always ask for ladder (for simulation)
- Keep outputs deterministic and strictly JSON
