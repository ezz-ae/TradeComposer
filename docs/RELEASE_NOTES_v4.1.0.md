
# TradeComposer v4.1.0 — Hardened

**Server**
- Firebase Admin auth on every user-, connection-, and payment endpoint.
- Firestore persistence for users, connections, payments.
- Coinbase Commerce charge creation + verified webhook (HMAC).

**Web**
- WalletConnect via wagmi/RainbowKit provider.
- Billing UI triggers real charge creation; opens `hosted_url` when present.

**Ops**
- `apps/partner-api/requirements.txt` for Cloud Run build.
- Keep `COINBASE_COMMERCE_API_KEY` and `COINBASE_COMMERCE_SECRET` in secrets.
