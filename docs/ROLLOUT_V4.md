
# Rollout — v4.0.0

1) **Envs**: copy `apps/web/.env.local.example.v4` → `.env.local` and set all values.
2) **Rules/Indexes**: `firebase deploy --only firestore:rules,firestore:indexes`.
3) **API**: deploy Partner API (Cloud Run). Update `NEXT_PUBLIC_PARTNER_API_URL`.
4) **Payments**: set provider secret(s) in Cloud Run/Functions; create test charge.
5) **UI**: verify Dashboard pages render and orchestration calls succeed.
6) **Release**: tag `v4.0.0` with notes.
