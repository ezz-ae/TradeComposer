
# TradeComposer v4.2.0 — Finalized API & Connections

**What’s new**
- **CCXT** connectors (Binance, OKX, Bybit) with link/list/balance/trade endpoints.
- Secrets stored in **Google Secret Manager** (per-connection); no raw keys in Firestore.
- Optional **KMS** envelope for at-rest encryption (local AESGCM fallback for dev).
- **Entitlements**: Coinbase webhook grants credits/plans automatically on `confirmed`.
- **Connections UI**: link exchanges and pull balances from the web app.
