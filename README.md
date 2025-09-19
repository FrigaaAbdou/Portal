MERN + Tailwind v3 Starter

Scripts
- `npm run dev` — runs server (Express) and client (Vite) together
- `npm run dev:server` — runs Express server only
- `npm run dev:client` — runs Vite client only
- `npm run build` — builds the React client
- `npm start` — starts the Express server (prod)

Environment
- Copy `server/.env.example` to `server/.env` and fill values
  - `PORT=5000`
  - `MONGODB_URI=your-mongodb-connection-string`

Structure
- `server/` — Node.js/Express API, MongoDB (mongoose)
- `client/` — React (Vite) + Tailwind CSS v3

Dev Proxy
- Client requests to `/api/*` are proxied to the server at `http://localhost:5000`
# Portal
