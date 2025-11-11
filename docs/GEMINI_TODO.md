
# Gemini TODO — V3.1

## 1) Plan JSON → UI diff
- Prompt to output a UI diff block (component + props) in addition to the plan:
  - `ui`: `{ component: "PlanCards", props: { ... } }`
- Client: apply diff to hot-render PlanCards.

## 2) Explainability short-forms
- Add `explain2` (<= 140 chars) + `explain10` (<= 2 lines) alongside `reason`.
- Display in Review modal; store in `reasons.csv`.

## 3) Risk critique → auto suggestions
- Add `critique.apply` candidate patch:
  - `[ { id:'slipCap', to: 10, why: '...' }, ... ]`
- One-click “apply” with confirmation and audit note.

## 4) Orchestrated Review bundle
- `/api/ai/orchestrate?mode=review` packs: `plan, reason, critique, explain2`.

## 5) Guarded Force rationale
- Require `why.force` and `counterfactual` fields before enabling Force.
- Prompt template provided in `docs/GEMINI.md` addendum.
