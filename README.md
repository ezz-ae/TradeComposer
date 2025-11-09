
# Trade Composer — Monorepo (Starter)

This is a ready-to-run scaffold for the **Trade Composer** platform.

## Quick start

### Requirements
- Node 18+ and **pnpm**
- Python 3.11+
- (Optional) Docker for ClickHouse/Redis

### Run
1) Install deps for TS workspaces
```bash
pnpm install
```
2) Start the Partner API
```bash
uvicorn apps.partner-api.main:app --reload --host 0.0.0.0 --port 8080
```
3) Start the Web app (set API URL in env)
```bash
export PARTNER_API_URL=http://localhost:8080
pnpm dev:web
```
