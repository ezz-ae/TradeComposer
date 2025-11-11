
# Audit Logger (Cloud Functions 2nd gen)

Deploy as an HTTP container:
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

npm i
npm run build

gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/audit-logger:v1
gcloud run deploy audit-logger --image gcr.io/YOUR_PROJECT_ID/audit-logger:v1 --platform managed --region us-central1 --allow-unauthenticated
# then restrict with Cloud Armor or require ID tokens from web client

# set env: BQ_DATASET, BQ_TABLE
gcloud run services update audit-logger --update-env-vars BQ_DATASET=tradecomposer,BQ_TABLE=audit_events
```
BigQuery schema suggestion:
- type: STRING
- orgId: STRING
- sessionId: STRING
- who: STRING
- ts: TIMESTAMP
- payload: JSON
