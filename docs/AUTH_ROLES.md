
# Auth Roles (V3.1)

## Roles
- **admin**: edit org policy + locks, manage org catalogs, set org defaults.
- **editor**: set session preset, run SEE actions, export packs.
- **viewer**: read-only UI, no SEE actions, can download exports if allowed.

## Implementation
- Firebase Auth + custom claims: `token.role in {admin,editor,viewer}`.
- Firestore rules:
  - `orgPolicy`: write admin-only; read everyone in org.
  - `sessions/*/policy`: write admin|editor; read all.
- UI guards:
  - Hide admin components unless `role=admin`.
  - Disable SEE CTAs for `viewer`.
