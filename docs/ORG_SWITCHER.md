
# Multi-tenant Org Switcher (V3.1)

## UX
- Org dropdown in the header (recent orgs, search).
- Persists `orgId` in local storage and querystring `?org=`.

## Data
- Firestore: `orgs` collection with `name`, `slug`, `members`.
- Policy lives under `orgs/{orgId}/policy` and `orgs/{orgId}/sessions/*`.

## Hook
- `useOrgCloudPolicy(orgId, sessionId)` already supports dynamic orgId — hot reload listeners on org change.
