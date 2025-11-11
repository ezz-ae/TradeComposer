
# Data Model (Firestore-first)

- `/orgs/{orgId}`: { name, slug }
- `/orgs/{orgId}/policy/orgPolicy`: org presets + locks
- `/orgs/{orgId}/sessions/{sessionId}/policy`: session overrides
- `/orgs/{orgId}/users/{uid}`: profile, plan, usage
- `/orgs/{orgId}/users/{uid}/connections/{connId}`: exchange/wallet/webhook configs
- `/orgs/{orgId}/users/{uid}/payments/{paymentId}`: status records (written by webhooks)
- (Optional) `/orgs/{orgId}/sessions/{sessionId}/journal/*`: SEE event logs
