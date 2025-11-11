
# TradeComposer v3.0.0

**New**
- Org + Session policy in Firestore with live sync (flag: `NEXT_PUBLIC_ORG_CLOUD=true`).
- Cloud Run–ready Partner-API (Dockerfile + docs).

**Upgrade**
```bash
unzip TradeComposer-v3.0.0.zip -d .
# Env
printf "\nNEXT_PUBLIC_ORG_CLOUD=true\n" >> apps/web/.env.local
# Firebase web app creds → apps/web/.env.local
# Deploy Firestore rules
firebase deploy --only firestore:rules
# Cloud Run API (optional but recommended)
# -> follow deploy/cloud-run-api.md
git add . && git commit -m "release: v3.0.0 (cloud policy + cloud run api)" && git tag v3.0.0 && git push && git push origin v3.0.0
```
