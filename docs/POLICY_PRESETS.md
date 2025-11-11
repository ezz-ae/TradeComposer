
# Policy Presets (V2.0.2)

Make the **Force gate** tunable per session/preset without touching code.

## Presets
- **Safe**: slip ≤ 8 bps, kill ≤ 20 bps
- **Balanced** (default): slip ≤ 12 bps, kill ≤ 30 bps
- **Aggressive**: slip ≤ 18 bps, kill ≤ 45 bps

These thresholds feed the policy engine that merges rails + AI critique.

## UI
Use `PolicyPresetSwitcher` near your Risk Adaptor:
```tsx
import PolicyPresetSwitcher from "@/app/components/PolicyPresetSwitcher";

<PolicyPresetSwitcher riskKnobs={risk.knobs} scope={scopeData} />
```

The active preset is stored in `localStorage (tc.policy.presets.v1)` and
**exported** inside the forensic ZIP (`gate` field in `env.json` pack).
