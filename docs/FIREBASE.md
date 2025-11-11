
# Firebase Setup (Local + Hosting)

## Local Emulators
- Uses **IPv4** hosts to avoid `::1` binding problems.
- App Hosting will spawn `npm run dev` which runs Next on **:3000**.

```bash
firebase login
firebase use tradecomposer-dev
firebase emulators:start
```

If you need a different port:
- Change `PORT` in `firebase.json` devModeHandle env or run `PORT=4000 npm run dev`.
