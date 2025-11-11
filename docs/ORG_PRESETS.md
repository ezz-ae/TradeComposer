
# Org Presets (hierarchy + locks)

**Goal:** org defines the baseline, users tune within boundaries, sessions can override when allowed.

## Hierarchy
1. **Org default** (catalog + defaultPresetId) → starting thresholds.
2. **User active preset** overlays when the org has not locked that field.
3. **Session preset** overlays last and only for fields not locked at org.

## Locks
- `slipCapMaxBps`, `killGapMaxBps` → when locked, user/session cannot change that dimension.
- Stored in `localStorage: tc.policy.org.v1`.

## Components
- `OrgPolicyAdmin` — set org default + locks.
- `SessionPolicySelector` — choose per-session override or inherit.

## Export
The forensic ZIP now includes:
- `orgGate`, `userGate`, `sessionGate`, and `sessionId` for full audit context.
