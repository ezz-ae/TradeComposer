
# TradeComposer — V2.0.1

Partner-first, composable trading UX — audit-grade by default.

## Quickstart

```bash
npm i -g pnpm
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local
pnpm install

# run API
npm run dev:api

# run web (Next.js 14)
npm run dev
# open http://localhost:3000
```

## Firebase (local)
```bash
firebase emulators:start
# apphosting runs `npm run dev` and proxies to port 3000
```

## What changed in 2.0.1
- **Next 14.2.5** pin to fix `react-dom/server.edge` export errors.
- **Root dev scripts** so **npm** works with workspaces (Firebase friendly).
- **IPv4 emulator hosts** to avoid `::1` port probe issues.
- **Gemini 1.5 prompt pack** and system patterns included (see `docs/GEMINI.md`).
- **Project details** and first-user TODO refreshed.
- Keeps depth/forensics layers: contextful queue, replay, guarded Force, forensic zip with CSVs.

See `docs/CHANGELOG.md` for the full diff.
