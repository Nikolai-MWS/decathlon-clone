# Phase 1 — Catalog Domain + Seed Implementation Plan

> **For agentic workers:** Implement task-by-task with TDD. npm workspaces (see Phase 0 plan's npm conventions). The shared package is CommonJS; build it after adding types (`npm run build --workspace @decathlon/shared`).

**Goal:** Model the catalog domain (categories, brands, products, variants, SKUs, pricing, inventory) in TypeORM, expose read APIs, and seed a realistic Decathlon-like dataset.

**Architecture:** Layered NestJS `catalog` module (Controller → Service → TypeORM repositories). Shared DTO/types in `packages/shared`. A first TypeORM migration creates all tables. A seed script (`apps/api/src/database/seed.ts`) populates categories (tree), brands, and products with variants/SKUs/pricing.

**Tech Stack:** NestJS 11, TypeORM 0.3 + PostgreSQL, Jest + Supertest.

---

## Data Model

- **Category**: `id, name, slug, parentId (self-FK), position`. Self-referencing tree (All Sports → sport → sub-category; plus Men/Women/Kids/Accessories/Electronics).
- **Brand**: `id, name, slug`.
- **Product**: `id, name, slug, description, brandId, categoryId, ratingAvg, reviewCount, createdAt`.
- **ProductVariant**: `id, productId, colorName, slug`. One row per color; mirrors the site's per-color URLs.
- **ProductImage**: `id, variantId, url, position`.
- **Sku**: `id, variantId, size, stock`. One row per size within a variant.
- **Price**: `id, productId, currentEur, oldEur (nullable), discountPct (nullable), promoStart (nullable), promoEnd (nullable)`. BGN is derived at read time using a fixed rate.

Money: store EUR as integer cents to avoid float drift. BGN derived via fixed rate (1 EUR = 1.95583 BGN, Bulgaria's fixed lev peg).

## Read API (all under `/api`)

- `GET /categories` → category tree (nested children).
- `GET /brands` → all brands.
- `GET /products?categorySlug=&brandSlug=&page=&pageSize=&sort=` → paginated product summaries (card data: name, slug, brand, first image, price block, rating).
- `GET /products/:slug` → full product detail (variants, images, SKUs/sizes, price, brand, category, breadcrumb path).

## Shared types (`packages/shared`)

`Money` (eurCents, bgnCents, formatted), `PriceDto`, `CategoryNodeDto`, `BrandDto`, `ProductCardDto`, `ProductDetailDto`, `VariantDto`, `SkuDto`, `Paginated<T>`, `ProductQuery`.

---

## Task 1: Shared catalog DTOs + money helper (TDD)
Add `packages/shared/src/money.ts` (`eurCentsToMoney`, fixed BGN rate, formatting) with tests; add `packages/shared/src/catalog.ts` (all DTO interfaces); export from barrel; build shared.

## Task 2: TypeORM entities
Create `apps/api/src/catalog/entities/*.entity.ts` for Category, Brand, Product, ProductVariant, ProductImage, Sku, Price with relations. No business logic.

## Task 3: Initial migration
Generate/author the migration creating all catalog tables + FKs + indexes (slug unique indexes). Run it against the Docker DB; verify tables exist.

## Task 4: Catalog service + repositories (TDD)
`CatalogService` methods: `getCategoryTree`, `getBrands`, `findProducts(query)`, `getProductBySlug`. Unit-test query/mapping logic against a test module with repository mocks or a test DB.

## Task 5: Catalog controller + DTassembly (e2e)
`CatalogController` exposing the 4 endpoints; map entities → shared DTOs (with derived BGN + formatting). e2e test hitting each endpoint against a seeded test DB.

## Task 6: Seed script + npm script
`apps/api/src/database/seed.ts` populating a realistic dataset: ~8 top categories, sub-categories, ~10 brands, ~40+ products across sports with variants/SKUs/pricing (some discounted with promo dates, some out-of-stock sizes). Add `"seed": "ts-node src/database/seed.ts"` to api scripts. Run it; verify row counts and that `GET /products` returns data.

## Task 7: Verify + commit + push
Full lint/test/build, e2e, manual: boot API, curl `/api/categories`, `/api/products`, `/api/products/:slug`. Commit per task; push.
