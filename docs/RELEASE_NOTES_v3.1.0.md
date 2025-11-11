
# TradeComposer v3.1.0 — Roles, Orgs, Audit

**Planned**
- Auth roles (admin/editor/viewer) with UI guards and Firestore rules.
- Org switcher (multi-tenant ready).
- Audit streaming to BigQuery.
- Gemini TODO features: UI diff, explain short forms, risk auto-suggest, review bundle, Force rationale.

**How to roll**
- Add Firebase Auth custom claims + tighten Firestore rules.
- Add org picker UI + plumb `orgId` through hooks.
- Deploy a 2nd gen Cloud Function for audit → BigQuery.
- Update Gemini prompts & client handlers for the TODO set.
