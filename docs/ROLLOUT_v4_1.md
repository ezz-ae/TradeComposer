
# Rollout — v4.1.0

## API (Cloud Run)
- Build container with requirements.txt; include service account to access Firestore.
- Env vars:
  - `FIREBASE_PROJECT_ID`
  - `COINBASE_COMMERCE_API_KEY`
  - `COINBASE_COMMERCE_SECRET`

## Web
- Install wallet deps:
  `pnpm add -w wagmi viem @rainbow-me/rainbowkit qrcode.react`
- Set `WALLETCONNECT_PROJECT_ID` in Wallet.tsx.
- Ensure web gets a Firebase ID token in `window.firebaseUser` after login.

## Coinbase
- Create webhook pointing at `/api/payments/webhook/coinbase`.
- Paste signing secret to Cloud Run env.
- Test: create payment, complete checkout, confirm Firestore status flips to `confirmed`.
