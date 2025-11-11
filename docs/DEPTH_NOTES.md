
# Depth Patch

## 1) Handshake (Review → Test/Prioritize/Force)
- **/api/orders** proxy adds required headers (`x-role`, `x-device-lease`) from env.
- **ReviewOverlay** now has **Test / Prioritize / Force** buttons.
- **Force** is automatically **blocked** if rails indicate `slipCapped` or `killHigh`.

### Env (Web)
```
PARTNER_API_URL=http://localhost:8080
PARTNER_API_ROLE=pro
PARTNER_API_DEVICE_LEASE=dev-lease-demo
```
(Or `NEXT_PUBLIC_*` variants if needed.)

## 2) Persistence
- **Journal** is saved to **IndexedDB** (`tc.db/journal.items`) and reloaded on boot.
- **Export** creates a `trade-composer-session.tcpack.json` with all journal entries.

## 3) Containers
- `apps/partner-api/Dockerfile` and `apps/web/Dockerfile`
- `docker-compose.yml` to run both:
  ```sh
  docker compose up --build
  ```

## 4) CI
- Minimal GitHub Actions workflow: install, type-check, build.

## 5) How to use
- Hit **Checkchart** → **SEE (Review)** → **Review Packet** modal shows JSON
- Click **Test** / **Prioritize** in the modal to POST `/api/orders`
- **Force** is greyed out when rails are breached (SlipCap > 12 bps or KillGap > 30 bps)
- Journal persists between refreshes; **Export** produces a portable session pack
