
# Hosting Deploy (Two Options)

## A) Firebase Hosting — Web Frameworks (Next.js)
Best for `firebase deploy` simplicity. The CLI detects Next in `apps/web` and builds SSR with a regional backend.

**Setup**
1. Ensure `firebase.json` includes:
```json
{
  "hosting": [{
    "source": "apps/web",
    "frameworksBackend": { "region": "us-central1" }
  }]
}
```
2. Auth and deploy:
```bash
firebase login
firebase use tradecomposer-dev
firebase deploy
```
3. Configure API env via Firebase `hosting:env:apply` (or use `.env` on your backend).

## B) Firebase App Hosting
Push the repo; App Hosting builds and runs Next via `firebase.apphosting.yaml`.

**Steps**
- Add `firebase.apphosting.yaml` at repo root.
- In Firebase Console → App Hosting → Connect GitHub repo → pick main.
- App Hosting runs the `build`/`run` commands from the yaml.

## CI (optional)
- Add `FIREBASE_SERVICE_ACCOUNT` JSON (base64 or plaintext) to repo secrets.
- Tag a release (`v2.0.1`), the workflow creates a GitHub Release and deploys Hosting.

```bash
git tag v2.0.1
git push origin v2.0.1
```
