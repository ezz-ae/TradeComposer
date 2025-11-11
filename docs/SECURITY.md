
# Security Notes

- Restrict Firestore writes via authenticated roles (viewer/editor/admin).
- Never store exchange API secrets client-side; use server vault (KMS/Secret Manager).
- Verify payment webhooks (HMAC) and only write payment docs from server.
- Log SEE actions to BigQuery audit (v3.1 audit logger) with ID token.
