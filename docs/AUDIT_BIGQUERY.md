
# Audit Streaming → BigQuery (V3.1)

## Goal
Append critical events to a BigQuery table for org-wide analytics.

## Events
- `see.test`, `see.prioritize`, `see.review`, `see.force`
- `policy.change` (org/user/session), `export.pack`

## Path
1. Add Cloud Function (2nd gen) with HTTP endpoint.
2. Client posts compact events; function writes to BigQuery table partitioned by day.
3. Secure with Firebase Auth ID token + org claim.
