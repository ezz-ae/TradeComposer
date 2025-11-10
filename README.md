
# Trade Composer — Monorepo (Starter)

This is a ready-to-run scaffold for the **Trade Composer** platform.

## Quick start

### Requirements
- Node 18+ and **npm**
- Python 3.11+
- (Optional) Docker for ClickHouse/Redis

### Run
1) Install dependencies
```bash
npm install
```
2) Start the Partner API (in a separate terminal)
```bash
uvicorn apps.partner-api.main:app --reload --host 0.0.0.0 --port 8080
```
3) Start the Web app (in a separate terminal)
```bash
npm run dev
```
