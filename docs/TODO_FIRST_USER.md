
# TODO — To First User

## Zero-1: Boot & Flow
- [ ] Fix workspace scripts: `pnpm --filter web dev` and `pnpm --filter partner-api dev`
- [ ] .env.local for web (URL/role/lease)
- [ ] `uvicorn` for API; verify `/health`

## Zero-2: Product Loops
- [ ] **Checkchart** returns plan with OP-1 task
- [ ] **SEE** hotkeys working (T, P, R, Enter)
- [ ] **Review** → **Test/Prioritize/Force** (guarded + templates)
- [ ] **Quoter Sim** produces filled/partial/no_fill; ladder visible
- [ ] **Queue** reflects SEE + Review actions (WS updates)
- [ ] **Risk Adaptor** clamps to guardrails; **Force** disabled on breach

## Zero-3: Persistence & Export
- [ ] Journal persists via IDB
- [ ] Export Zip contains journal, presets, env, scope, risk, plan, sim, queue
- [ ] Replay (manual via Journal dump) checked

## Zero-4: Polish
- [ ] Toasts for failure states
- [ ] Hotkeys legend visible
- [ ] Basic 404 and error boundary in web
- [ ] API input validation (pydantic) tightened

## Zero-5: Ship
- [ ] Docker Compose up on a clean VM
- [ ] CI green on main
- [ ] One-page README linking **DEPTH_NOTES**, **QUEUE_AND_LADDER**, **QUOTER_SIM**, **OPERATIONS**
