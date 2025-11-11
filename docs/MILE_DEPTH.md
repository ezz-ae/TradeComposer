
# Mile-in-Depth Patch

## Guarded Force (2-step)
- Force from Review now opens **ForceShield** requiring:
  - Text reason (>= 12 chars)
  - Explicit acknowledgement checkbox
- Reason is sent with the order body as `{ reason }`

## Real ZIP Export
- Client gathers:
  - Journal (IndexedDB)
  - Composer Presets (localStorage `tc.composer.presets.v1`)
  - Basic env (`NEXT_PUBLIC_PARTNER_API_URL`)
- Posts to `POST /api/export` → returns `trade-composer-pack.zip`

### Install extra dep
```
pnpm add archiver
# or: npm i archiver
```

## Usage
- Click **Export Zip** in the header to download a support bundle.
- In **Review**, click **Force** → fill reason → confirm; blocked if rails breached.
