
# Schema-Driven UI (PlanCards)

Renders SEE Plan tasks directly from the validated plan schema.

## Component
- `apps/web/components/PlanCards.tsx`
- Props:
  - `plan` (from SeePlanZ)
  - `riskKnobs`, `scope`
  - `onAction(mode, task)` → wire to your SEE/Review/Force handlers

Primary OP task (id starting with `OP-`) is highlighted.

Buttons:
- **Test / Prioritize / Review / Force** — Force auto-disabled by **policy gate**.
