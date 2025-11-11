
# Cloud Run deploy (Partner-API)

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Build
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/tradecomposer-api:v3

# Deploy
gcloud run deploy tradecomposer-api   --image gcr.io/YOUR_PROJECT_ID/tradecomposer-api:v3   --platform managed   --region us-central1   --allow-unauthenticated   --port 8080

# After deploy: set NEXT_PUBLIC_PARTNER_API_URL to the Run URL in Hosting/App Hosting env.
```
