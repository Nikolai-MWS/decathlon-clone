# Decathlon.bg Clone — Master Design

**Date:** 2026-06-08
**Status:** Approved (master design); phase specs to follow
**Goal:** A full-stack, e-commerce application that replicates the core features and user flows of decathlon.bg, built for learning/portfolio with an emphasis on clean architecture and complete coverage of the site's functionality.

## 1. Scope & Intent

Replicate decathlon.bg's **functionality and user flows** — not its proprietary data or private integrations. We use our own synthetic (Decathlon-like) catalog data and sandbox integrations (Stripe test mode). The target is a complete, faithful storefront experience, delivered as a sequenced roadmap of sub-projects so every detail is covered without sacrificing code quality.

### Out of scope / substituted
- Real Decathlon catalog data, images, prices, stock → **synthetic seed data** modeled on observed structure.
- Real payments / banking → **Stripe test mode** (test cards, webhooks, no real money).
- Real Decathlon accounts, loyalty redemption, B2B, financing, "second life", DECATHLON Play activities → **stubs or omitted**.
- Admin/backoffice UI → **omitted**; catalog and orders are managed via seed scripts and migrations.

## 2. Observed Site Reference (first-hand research)

Captured by driving a real browser against the live site on 2026-06-08.

**Header:** logo, search, "My profile" (account), cart, store-locator link, FAQ.
**Mega-menu nav:** All Sports, Men, Women, Kids, Accessories, Nutrition & Health, Electronics, Special Offers, Sale, Blog.
**Homepage:** rotating promo bar, hero banners, category tiles, "Popular products" carousel, popular categories, sport tiles, brand grid, services section, rich footer with delivery/payment partners (Speedy, Econt, Sameday, BoxNow; VISA, MasterCard, Apple Pay, PayPal).
**Product cards:** brand, title, star rating + review count, dual currency (EUR + BGN), discount badge + old price + promo date range, "Last items"/"Low price"/"2 for -12%" badges.
**PDP:** breadcrumb, image gallery, brand, title, rating + review count, description, product ID, price block (current/old/discount %/promo period, dual currency), color variants (each color = a separate product URL), size selector (dropdown), quantity, add-to-cart, per-size stock with "notify me" when out of stock, delivery options (store pickup / home delivery with ETA), expandable info sections (advantages, care & use, characteristics/specs, tests, environmental impact), reviews.

## 3. Technical Decisions (locked)

| Area | Decision |
|------|----------|
| Repo | Monorepo, pnpm workspaces: `apps/web`, `apps/api`, `packages/shared` |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL + TypeORM (with migrations) |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS + headless accessible primitives (Radix/Headless UI) |
| Server state | TanStack Query |
| Routing | React Router |
| Payments | Stripe (test mode) |
| Catalog data | Synthetic seed mirroring Decathlon structure |
| i18n | Bilingual BG/EN (react-i18next), language switcher |
| Currency | Dual display EUR + BGN, stored once (EUR base), fixed BGN conversion |
| Auth | JWT access token + httpOnly refresh-token cookie; guest carts supported |
| API style | REST + Vite SPA (no SSR) |
| Admin UI | None (seed scripts) |

## 4. Architecture

**Backend — layered NestJS, modules by domain.**
- Modules: `catalog`, `search`, `cart`, `auth`, `users`, `orders`, `checkout`, `reviews`, `inventory`, `pricing`.
- Each module: `Controller` (HTTP, DTOs validated by `class-validator`) → `Service` (business logic) → `Repository`/TypeORM entities.
- Shared response and error envelope; global exception filter; config via `@nestjs/config`.

**Shared package** (`packages/shared`): DTOs, request/response types, enums, shared validation schemas — imported by both apps to prevent type drift.

**Frontend — feature-folder React.**
- `features/<domain>` (catalog, cart, auth, orders, …), `ui/` design-system layer (Button, Price, ProductCard, RatingStars, Badge, …), `api/` typed client over the shared types, `i18n/` resources.
- TanStack Query for data fetching/caching; React Router for routes.

## 5. Data Model (core entities)

- **Category** — self-referencing tree (All Sports → sport → sub-category; Men/Women/Kids/Accessories/Electronics).
- **Brand** — Quechua, Kiprun, Btwin, Adidas, etc.
- **Product** — title, slug, description, brand, category, rating aggregate, review count.
- **ProductVariant** — a color (own slug + images), mirroring the site's per-color URLs.
- **Sku** — a size within a variant: size value, stock quantity, optional price override.
- **Price** — EUR base amount, derived BGN, optional old price, discount %, promo start/end.
- **ProductImage**, **ProductAttribute** (specs/advantages/care for PDP sections).
- **User**, **Address**, **Cart** + **CartItem**, **Order** + **OrderItem** + **Payment** + **Shipment**, **Review**, **WishlistItem**, **StockNotification**.

## 6. Full Feature Inventory

- **Storefront:** mega-menu nav, promo bar, homepage (hero banners, product carousels, category/sport tiles, brand grid, services), category/listing pages, PDP (gallery, color variants, size selector, price block with discount + promo dates + dual currency, per-size stock, notify-me, delivery options, expandable info sections), breadcrumbs, product cards.
- **Discovery:** full-text search, autocomplete, faceted filters (brand, price, size, color, rating, discount), sorting, pagination.
- **Commerce:** guest + user cart, mini-cart, checkout (delivery method: home / courier office / store pickup à la Speedy/Econt/BoxNow; address; Stripe payment), order creation/confirmation/status, order history.
- **Accounts:** register/login/logout, JWT + refresh, profile, addresses, password reset.
- **Engagement:** reviews & ratings, wishlist, store locator, notify-when-in-stock, newsletter, promo landing pages, blog stub, loyalty-points stub.
- **Cross-cutting:** i18n BG/EN, dual currency, accessibility, responsive design, error handling, testing.

## 7. Phased Roadmap

Each phase is its own sub-project: spec → plan → build → review. Built in dependency order.

| Phase | Name | Delivers |
|------|------|----------|
| 0 | Foundation | Monorepo, tooling, Docker Postgres, shared package, NestJS+TypeORM skeleton + migrations, React+Vite+Tailwind+router+i18n shell, design-system primitives, seed framework, CI, health checks |
| 1 | Catalog domain + seed | Categories/brands/products/variants/SKUs/pricing/inventory entities + read APIs + realistic seed data |
| 2 | Storefront browsing | Layout (header mega-menu, footer), homepage, category pages, PDP, product cards, dual currency, i18n wiring |
| 3 | Search & filters | Full-text search, faceted filters, sorting, pagination, autocomplete, search results page |
| 4 | Cart | Guest + user cart, add/update/remove, mini-cart, stock validation, cart page |
| 5 | Auth & accounts | Register/login/logout, JWT + refresh, profile, addresses, password reset, account dashboard |
| 6 | Checkout & orders | Delivery options, address, Stripe test checkout + webhook, order lifecycle, confirmation, order history |
| 7 | Reviews & ratings | Review create/list, rating breakdown, PDP integration, aggregates |
| 8 | Engagement extras | Wishlist, store locator, notify-me, newsletter, promo/blog stubs, loyalty stub |
| 9 | Hardening | Test coverage, accessibility, performance, observability, deployment docs |

## 8. Phase 0 — Foundation (next to plan)

**Outcome:** a running, empty-but-wired full-stack skeleton that everything else builds on.

- Monorepo with pnpm workspaces; root scripts (`dev`, `build`, `lint`, `test`, `format`).
- `apps/api`: NestJS app, `@nestjs/config`, TypeORM wired to PostgreSQL, migration setup, global validation pipe + exception filter, `/health` endpoint, example module to prove the layering, Jest configured.
- `apps/web`: React + Vite + TypeScript, Tailwind configured, React Router shell, TanStack Query provider, react-i18next with BG/EN resource scaffolding + language switcher, base layout (header/footer shells), `ui/` primitives (Button, etc.), Vitest + React Testing Library configured.
- `packages/shared`: TS project referenced by both apps; a sample shared DTO/type consumed end-to-end.
- Local infra: `docker-compose.yml` for PostgreSQL; `.env.example`.
- Tooling: ESLint + Prettier, shared tsconfig base, EditorConfig, CI workflow (install, lint, test, build).
- README with setup/run instructions.

## 9. Cross-Cutting Standards

- **Testing:** TDD per the project's discipline; unit tests for services, integration tests for controllers/repositories (test DB), component tests for UI, and key e2e flows in later phases.
- **Error handling:** consistent API error envelope; typed client errors on the frontend; user-friendly i18n error messages.
- **Validation:** `class-validator` DTOs on the backend; shared types keep the frontend in sync.
- **Accessibility:** semantic HTML, headless accessible primitives, keyboard and screen-reader support.
- **Currency/format:** EUR base stored; BGN derived at a fixed rate; locale-aware formatting.

## 10. Open Risks / Notes

- Stripe test integration requires sandbox keys in `.env` (documented, not committed).
- Synthetic seed must be large/realistic enough to exercise search, facets, and pagination meaningfully.
- BG/EN content for seed data: product copy authored in both languages (or BG with EN fallback) — decided per phase.
