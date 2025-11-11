
# Path to First User (detailed backlog)

## A. Make it feel real (UI/UX)
- [ ] Session Bar: symbol input, status pill (Idle/Armed/Live), Checkchart button.
- [ ] ScopeCanvas: dashed **Expected** vs solid **Real** curve; displays Confidence and R(t).
- [ ] SEE Tray: buttons + keyboard (Shift+T/P/R, Shift+Enter); stage animation and result toasts.
- [ ] Risk Adaptor: knobs (Traction, Conf Gain, Vol Damp, Wick Guard, Slip Cap bps, Kill Gap bps, TTL ms) with live R(t) readout.
- [ ] Guardrails panel: show Daily Cap, Slippage Cap, Kill Gap; colorize when breached.
- [ ] Executor panel: show current intents (bid/ask/size/ttl) and last result.
- [ ] Journal: table of actions (SEE events, API responses, WS snapshots), JSON export.

## B. Wire real brain (stubs → signals)
- [ ] Replace synthetic WS with mocked tick feed → recorder → tiny matcher 60s prediction.
- [ ] Composer: up to 4 matchers, weights −1..+1, optional delay; draw composite ghost in Scope.
- [ ] Patchboard: 15 jacks; drag cables; persist to localStorage + presets.
- [ ] Risk Adaptor → Executor: convert R(t) to size policy, slip cap, TTL in UI.

## C. Partner behavior
- [ ] Natural language **checkchart** command → same plan API.
- [ ] **Review packet** overlay to show exact JSON order intent.
- [ ] **Explain** tooltips for every button/knob (docs link targets).

## D. Infra & delivery
- [ ] GitHub Actions CI: build web + sanity check FastAPI.
- [ ] Dockerfiles + docker-compose: web:3000 and api:8080.
- [ ] Firebase Hosting for `apps/web` (emulator binds IPv4); API to Cloud Run.
- [ ] No secrets in repo; .env templates only.

## E. Onboarding to first user
- [ ] Landing (Readme/docs): what it is, safety rails, demo gif.
- [ ] First-Run Wizard: choose symbol, run Checkchart, try SEE Test → Journal logs.
- [ ] Invite link (manual) → Slack or email; collect feedback via GitHub Issues template.

## F. Stretch (post-first-user)
- [ ] Preset exchange (“give me this preset”), import/export JSON.
- [ ] Dynamic Quoter (replace-only) with real venue adapter.
- [ ] RiskGuard.sol front-end to display on-chain caps (read-only).
- [ ] Backtest & 2-min replay recorder UI polish.
