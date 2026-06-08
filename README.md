# Decathlon Clone

A full-stack e-commerce application (React + NestJS) replicating the core
features and flows of decathlon.bg. Portfolio project — synthetic data,
Stripe test mode.

## Features
- **Catalog** — nested categories, brands, products with color variants,
  per-size SKUs/stock, dual EUR/BGN pricing, discounts & promo dates
- **Storefront** — homepage, category listings (sort + pagination), product
  detail (gallery, variants, size selector, out-of-stock state)
- **Search** — full-text search, faceted filters (brand, price, rating,
  on-sale), autocomplete
- **Cart** — cookie-based guest cart, stock validation, mini-cart badge
- **Accounts** — register/login (JWT access + httpOnly refresh), profile,
  saved addresses
- **Checkout** — delivery options (store/office/home, free over €50),
  address prefill, payment, order confirmation + order history
- **Reviews** — ratings with per-star breakdown, write reviews (auth)
- **Engagement** — wishlist, notify-me-when-in-stock, newsletter, store
  locator, blog
- **Cross-cutting** — bilingual BG/EN (i18next), responsive, accessible
  (skip link, focus rings, semantic landmarks), route-level code splitting

## Stack
- Monorepo: **npm workspaces** (`apps/web`, `apps/api`, `packages/shared`)
- Backend: NestJS + TypeORM + PostgreSQL
- Frontend: React + Vite + Tailwind + React Router + TanStack Query + i18next
- Payments: built-in sandbox by default; real Stripe (test mode) when keys set
- Tests: Jest/Supertest (api), Vitest/Testing Library (web/shared)

## Architecture
- **`packages/shared`** — TypeScript DTOs/types imported by both apps (one
  source of truth; compiled to CommonJS so the Nest runtime can load it).
- **`apps/api`** — layered NestJS (Controller → Service → TypeORM repository),
  domain modules: catalog, cart, users, auth, orders, reviews, engagement.
  Global validation pipe + error envelope; migrations under
  `src/database/migrations`; seed in `src/database/seed.ts`.
- **`apps/web`** — feature-folder React (`features/<domain>`), `ui/` design
  system, typed `apiClient`, TanStack Query for server state, lazy-loaded
  routes.

## Prerequisites
- Node 20+, npm 10+, Docker

## Setup
```bash
npm install
cp .env.example apps/api/.env   # adjust if needed
docker compose up -d            # start PostgreSQL (host port 5433)
```

> Note: PostgreSQL is published on host port **5433** (not the default 5432)
> to avoid clashing with any other local Postgres. The container still uses
> 5432 internally; `apps/api/.env` and `.env.example` point at 5433.

## Run (dev)
```bash
# terminal A
npm run dev --workspace @decathlon/api     # http://localhost:3000/api
# terminal B
npm run dev --workspace @decathlon/web     # http://localhost:5173
# or both at once from the repo root:
npm run dev
```

Visit http://localhost:5173/health — it should show `api: ok`.

## Seed data
```bash
npm run migration:run --workspace @decathlon/api   # create tables
npm run seed --workspace @decathlon/api            # 10 brands, 15 categories, 28 products
```

## Common scripts
- `npm run lint` — lint all packages
- `npm test` — run all unit/component tests
- `npm run build` — build all packages
- `npm run test:e2e --workspace @decathlon/api` — API e2e tests
- `npm run migration:generate --workspace @decathlon/api <path>` — generate a migration
- `npm run migration:run --workspace @decathlon/api` — run DB migrations

## Payments (Stripe — optional)
By default the app uses a **built-in sandbox** that mirrors Stripe's
PaymentIntent lifecycle, so checkout works with no external keys (a test
"pay" panel confirms the order). To use **real Stripe test mode**, set in
`apps/api/.env`:
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
The API then creates real PaymentIntents and finalizes orders via the
signature-verified webhook at `POST /api/checkout/webhook`
(`stripe listen --forward-to localhost:3000/api/checkout/webhook`).

## Deployment
- **Database:** any managed PostgreSQL 16; run `migration:run` on deploy.
- **API:** `npm run build --workspace @decathlon/api` → run
  `node apps/api/dist/main.js`. Provide env vars (DB_*, JWT_*, WEB_ORIGIN,
  optional STRIPE_*). Set `WEB_ORIGIN` to the deployed web origin for CORS.
- **Web:** `npm run build --workspace @decathlon/web` → serve `apps/web/dist`
  as static files; set `VITE_API_URL` at build time to the API URL.
- **CI:** `.github/workflows/ci.yml` runs install/lint/test/build with a
  PostgreSQL service on every push/PR.

## Project docs
- Master design: `docs/superpowers/specs/2026-06-08-decathlon-clone-design.md`
- Phase plans: `docs/superpowers/plans/`
