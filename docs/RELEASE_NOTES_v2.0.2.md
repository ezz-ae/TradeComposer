
# TradeComposer v2.0.2

**New**
- Policy Presets: Safe/Balanced/Aggressive thresholds for Force gating.
- Export now includes gate config for full auditability.
- Firebase Hosting preview deploys on PR/branch.

**Upgrade**
Unzip the patch at repo root, then:
```bash
git add .
git commit -m "release: v2.0.2 (policy presets + staging deploys)"
git tag v2.0.2
git push && git push origin v2.0.2
```
