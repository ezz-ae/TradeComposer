
# Payments (Crypto)

## Option A — Coinbase Commerce
- Create a charge server-side and redirect the user to Coinbase checkout.
- Verify events with `X-CC-Webhook-Signature` HMAC using `COINBASE_COMMERCE_SECRET`.
- On `confirmed`, write `/payments/{id}` with `status=confirmed`.

## Option B — Manual on-chain (USDC on Polygon)
- Generate a deposit address per user (custody service or wallet infra).
- Detect incoming transfers via webhook/indexer, call `/api/payments/webhook/manual` with `{ paymentId, status: "confirmed" }`.
- Credit entitlements (e.g., unlock editors).

> The scaffold includes `/api/payments/create`, `/api/payments/webhook/coinbase`, `/api/payments/webhook/manual`.
