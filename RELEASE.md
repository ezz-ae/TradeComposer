# TradeComposer v3.1.0

This bundle contains:
- V3.0.0 (cloud org policy + Cloud Run API)
- V3.1.0 code (roles, hardened rules, audit logger, org switcher)
- V3.1 docs pack (status, roadmap, gemini TODO, etc.)

## How to cut the release
1. Commit and push bundle to `main`.
2. Ensure secrets:
   - `FIREBASE_SERVICE_ACCOUNT` (JSON) in GitHub Actions secrets.
   - (Optional) Audit function URL set as `NEXT_PUBLIC_AUDIT_URL` in your env.
3. Tag the release:
```bash
git tag v3.1.0
git push origin v3.1.0
```
4. The workflow `.github/workflows/release-v3.1.yml` will:
   - Build the workspaces
   - Create the GitHub Release with `docs/RELEASE_NOTES_v3.1.0.md`
   - Deploy Hosting to the **live** channel
