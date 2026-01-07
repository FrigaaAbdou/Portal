# Portal Dev Runbook (Node 20, Vite)

Quick steps to get the stack running cleanly and avoid the previous “API not listening / blank frontend” issues.

## Prereqs
- Node 20 (use `nvm install 20 && nvm use 20` or Node 20 Docker image).
- MongoDB reachable (or leave `MONGODB_URI` empty to skip DB during smoke tests).
- No real secrets committed; copy `.env.example` and set local overrides.

## One-time setup
```bash
# from repo root
nvm install 20 && nvm use 20      # or use your Node 20 binary

rm -rf server/node_modules client/node_modules package-lock.json
npm install --prefix server
npm install --prefix client
```

## Run locally
```bash
# API (requires Node 20)
PORT=5001 MONGODB_URI= npm run dev --prefix server

# Frontend (points to backend via VITE_API_URL)
VITE_API_URL=http://localhost:5001 npm run dev --prefix client
```
Hit `http://localhost:5001/api/health` and `http://localhost:5173/` to verify.

## Common pitfalls
- **Wrong Node version**: Node 24 caused `mongoose` to hang and the server never reached `app.listen`. Stick to Node 20.
- **Stale node_modules / lockfile**: If the dev server hangs or Vite shows a blank screen, wipe `node_modules` and `package-lock.json`, then reinstall with Node 20.
- **Toolchain drift**: Vite is pinned (`5.2.13`) and `@vitejs/plugin-react` is pinned. Don’t bump them unless intentionally testing upgrades.
- **Ports in use**: macOS Control Center sometimes occupies 5000. Use 5001 for the API and 5173 for Vite dev (4173 for `vite preview`).
- **Env secrets**: Never commit real keys; use `.env.example` as a template and keep real values local or in a secret manager.

## Optional: Docker (suggested)
- Use a `node:20` base image for both server and client.
- `docker-compose` suggestion: services for `api` (port 5001), `client` (5173), and `mongo` (27017). Mount source for hot reload in dev.
- Health checks: `curl http://api:5001/api/health` and `curl http://client:5173/`.

## Quick reset script (manual steps)
```bash
nvm use 20
rm -rf server/node_modules client/node_modules package-lock.json
npm install --prefix server
npm install --prefix client
PORT=5001 MONGODB_URI= npm run dev --prefix server
VITE_API_URL=http://localhost:5001 npm run dev --prefix client
```

Keep this file updated as you change versions or add Docker configs.
