
# Changelog

## 2.0.1 — Firebase & Workspace Unification
- Pin Next to 14.2.5 to resolve `Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: ./server.edge`
- Add root `npm run dev` wiring `pnpm --filter web dev` (Firebase App Hosting friendly)
- Emulator host set to `127.0.0.1` for hub/logging/apphosting
- Added `.env.example` and `apps/web/.env.local.example`
- CI and sanity script updated

## 2.0.0 — Depth + Forensics
- Guarded Force (2-step confirm), context snapshots, replay bridge/scrubber
- Forensic export: `frames.csv`, `ladder.csv`, `reasons.csv` + JSON state
