
# Security in v4.2
- Exchange keys never touch the client after entry; sent over HTTPS to Partner-API and stored in **GSM**.
- Firestore holds only metadata and GSM version name; no secrets.
- Optional KMS for encrypt/decrypt if you want double-encryption beyond GSM.
- All protected endpoints require Firebase **ID token**; enforce roles via rules + custom claims.
