
# TradeComposer v3.0.0 — Cloud org policy + Cloud Run API

## Why this matters
- **Org-level governance** survives tabs/machines; everyone sees the same thresholds.
- **Session policy** travels with the session ID — stable audits and reproducible runs.
- **Cloud Run API** gives you a hard boundary for queue/execution and future multi-tenant routing.

## What changed
- `NEXT_PUBLIC_ORG_CLOUD` flag to enable Firestore sources of truth.
- `useOrgCloudPolicy` listens to org+session docs and mirrors to localStorage for offline.
- Partner-API ships with a Dockerfile for Cloud Run.
- Firestore rules sample included (tighten in prod).

## Rollout
1. Create Firebase Web App, set env vars in `apps/web/.env.local`.
2. `firebase deploy --only firestore:rules` (or via console).
3. Set `NEXT_PUBLIC_ORG_CLOUD=true`.
4. Deploy Partner-API to Cloud Run (see `deploy/cloud-run-api.md`). Point `NEXT_PUBLIC_PARTNER_API_URL` to the Run URL.
5. Tag and push `v3.0.0`.
