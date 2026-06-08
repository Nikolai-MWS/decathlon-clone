# Decathlon Clone

A full-stack e-commerce application (React + NestJS) replicating the core
features and flows of decathlon.bg. Portfolio project — synthetic data,
Stripe test mode.

## Stack
- Monorepo: **npm workspaces** (`apps/web`, `apps/api`, `packages/shared`)
- Backend: NestJS + TypeORM + PostgreSQL
- Frontend: React + Vite + Tailwind + React Router + TanStack Query + i18next
- Tests: Jest/Supertest (api), Vitest/Testing Library (web/shared)

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

## Common scripts
- `npm run lint` — lint all packages
- `npm test` — run all unit/component tests
- `npm run build` — build all packages
- `npm run test:e2e --workspace @decathlon/api` — API e2e tests
- `npm run migration:run --workspace @decathlon/api` — run DB migrations

## Project docs
- Master design: `docs/superpowers/specs/2026-06-08-decathlon-clone-design.md`
- Phase plans: `docs/superpowers/plans/`
