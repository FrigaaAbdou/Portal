# Sportall (Portal) — Monorepo

Production-ready MERN stack with Vite + Tailwind on the client and Express/Mongoose on the server. Includes billing (Stripe), verification flows (Resend + Twilio Verify), admin tools, and role-based routing.

## Stack
- Client: React (Vite), Tailwind CSS
- Server: Node.js/Express, Mongoose (MongoDB)
- Payments: Stripe checkout + billing portal
- Messaging/Verification: Resend (email), Twilio Verify (SMS)

## Requirements
- Node.js 18+ and npm
- MongoDB instance
- Stripe account + price IDs
- Resend and Twilio credentials if using verification flows

## Project Structure
- `client/` — Frontend app (Vite, Tailwind)
- `server/` — API (Express, Mongoose)
- `docs/` — Admin plan, brand kit, consultant contracts

## Setup
1) Install dependencies (from repo root):
```bash
npm install
```

2) Environment variables

**Server (`server/.env`)**
- `PORT` (default 5000)
- `CLIENT_ORIGIN` (e.g., http://localhost:5173)
- `MONGODB_URI`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_ANNUAL` (if used)
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID`
- `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD` (optional seed admin)
- `ADMIN_INVITE_TTL_HOURS` (optional)

**Client (`client/.env`)**
- `VITE_API_URL` (leave empty to use Vite proxy during local dev)
- `VITE_STRIPE_PRICE_MONTHLY`, `VITE_STRIPE_PRICE_ANNUAL` (to label plans in UI)

3) Local development
```bash
npm run dev          # runs server and client together
# or
npm run dev:server   # API only
npm run dev:client   # Frontend only (uses /api proxy to localhost:5000)
```

4) Build
```bash
npm run build        # builds the client (dist/) via Vite
```

5) Production start (after build)
```bash
npm start            # starts Express API; serve the built client from your host
```

## Scripts
- `npm run dev` — server + client concurrently
- `npm run dev:server` — Express only
- `npm run dev:client` — Vite only
- `npm run build` — client build
- `npm start` — Express in production mode

## API Proxy (local)
Client requests to `/api/*` proxy to `http://localhost:5000` during `npm run dev:client`.

## Documentation
- Admin plan: `docs/admin/admin-plan.md`
- Brand/Design Kit: `docs/brand/brand-design-kit.pdf`
- Consultant agreements: `docs/consultant/`

## Deployment Notes
- Provide production env vars on your host (see server/.env list).
- Configure Stripe webhooks to point to `/api/payments/webhook`.
- Ensure HTTPS for auth and webhook security.

## Support
Open an issue or reach out to the maintainers for onboarding questions.
