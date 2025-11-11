
# Trade Composer — Project Details (v0.2)

## What this is
Trade Composer is a Moog-style **trading instrument**. It is not an "AI does it all" bot. It’s a **partner** that:
- thinks continuously,
- surfaces opportunities and risk in plain language,
- lets the trader **compose** tactics (matchers) and **execute** with rails,
- teaches by doing alongside the user.

## Core ideas
- **Sessions:** one active API per session. Users can run multiple sessions, but tuning shines when focused.
- **SEE Pipeline:** *Review → Test → Prioritize → Force* modes with safe rails (shadow/canary).
- **Risk Adaptor:** sensor fusion → dynamic R(t), slip caps, kill-gaps, TTL, leverage hints.
- **Scripter/Matcher/Composer:** record price behavior, identify repeated scripts, arm up to 4 matchers, blend into a composite intent.
- **Quoter:** replace-only order intents per second with strict slippage caps and TTL.
- **Partner, not agent:** explain, warn, ask for confirmation, and **act with** the user.

## Architecture (mono-repo)
- `apps/web` — Next.js App Router UI. Panels: Session Bar, Scope, SEE, Patchboard, Composer, Risk, Executor, Guardrails, Journal.
- `apps/partner-api` — FastAPI partner service: plan, sessions, orders, websocket state.
- `packages/*` — types, intents, risk adaptor, planner, scripter, quoter (stubs now).
- `contracts` — on-chain guards (stubbed).

## Data flow (happy path)
1. User chooses symbol → **Checkchart** → `/api/plan` returns regime/levels/tasks.
2. User selects a task → **Review/Test/Prioritize/Force**.
3. Websocket pushes synthetic telemetry (expected vs real, confidence, R(t)).
4. Risk Adaptor modulates execution parameters (slippage cap/TTL) and suggests size policy.
5. Executor (placeholder) displays intents and rails; no live exchange keys in v0.

## Safety rails
- Headers `x-role=pro` and `x-device-lease` required for orders.
- `test` → canary size only; `prioritize` queues; `force` still checks rails.
- No custody, no PII, no user keys in v0.

## Where we should reach (v1 milestone)
- Real market data feed for Scripter/Matcher (record & predict 60s).
- Patchboard to override “normals” + Composer to blend 4 matchers.
- Full SEE tray (stage animation + logs).
- Risk Adaptor wired to Executor sizing + guardrails panel reacting to thresholds.
- Journal: append-only log + 2-min replay + export.
- Deploy: API on Cloud Run, Web on Firebase Hosting; invite-first onboarding.
