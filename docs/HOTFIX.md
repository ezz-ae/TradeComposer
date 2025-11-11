
# V3.1 Hotfix Flow

## Branching
- Create from latest v3.1 tag:
```bash
git checkout -b hotfix/v3.1.1 v3.1.0
```
- Fix, commit, push, open PR to `release/v3.1`.

## Validate Forensics Pack
- Export a pack from the UI or use the sample:
```bash
node scripts/validate-pack.mjs fixtures/trade-composer-pack.sample.zip
```
- CI also runs validator on PR.

## Cut the patch
```bash
node tools/version/bump.mjs 3.1.1
git add package.json
git commit -m "chore: bump to 3.1.1"
git tag v3.1.1
git push && git push origin v3.1.1
```
- The `hotfix-v3.1` workflow will create a GitHub Release and deploy to a preview channel named after the tag.
