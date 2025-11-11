
# V3.1 — Code Rollout

## 1) Firestore rules
```bash
firebase deploy --only firestore:rules
```

## 2) Roles
- Use `tools/admin/setRole.mjs` with a service account to set user claims.
```bash
node tools/admin/setRole.mjs ./serviceAccount.json <uid> admin
```

## 3) Org Switcher
- Add some org docs under `/orgs` (id, name, slug). The switcher will list them.

## 4) Audit
- Deploy the audit-logger container (functions/audit-logger).
- Set env: `BQ_DATASET`, `BQ_TABLE`.
- In web, call `sendAudit(functionUrl, event)` after SEE actions and policy changes.
