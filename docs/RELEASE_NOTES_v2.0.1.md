
# TradeComposer v2.0.1

**Highlights**
- Next.js pinned to **14.2.5** to resolve `react-dom ./server.edge` issue.
- Root scripts unified so **Firebase App Hosting** can call `npm run dev` / `npm run start`.
- Emulators bound to **127.0.0.1**; App Hosting proxies to **:3000** locally.
- Gemini 1.5 prompt pack + system guidance.
- Forensics layers intact: guarded Force, queue context, replay, CSV exports.

**Breaking Changes**
- None. You can upgrade by unzipping over your repo and `pnpm install`.

**Install**
```bash
npm i -g pnpm
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local
pnpm install
```

**Run**
```bash
npm run dev:api   # API on :8080
npm run dev       # Next on :3000
```

**Firebase (local)**
```bash
firebase emulators:start
```

**Changelog**
- See `docs/CHANGELOG.md`.
