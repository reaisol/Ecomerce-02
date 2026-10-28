<p align="center">
  <img src="apps/storefront/public/brand/trushop-logo.png" alt="trushop" width="320" />
</p>

<h1 align="center">trushop</h1>

<p align="center">
  Smart products. Better prices. Kitchen, storage, cleaning and home utility essentials, plus everyday tools, delivered across India.
</p>

---

## Overview

trushop is a direct-to-consumer e-commerce platform for the Indian market. The repository is a Turborepo monorepo with two apps:

| App | Path | Stack | Port |
|---|---|---|---|
| Storefront | `apps/storefront` | Next.js 15 (App Router), React 19, Tailwind CSS, TypeScript | 8000 |
| Commerce backend | `apps/backend` | Node.js commerce engine, PostgreSQL, Redis | 9000 (admin at `/app`) |

### Storefront features

- Homepage with hero, category cards, featured / best seller / new arrival / deal rails and promotions
- Catalog listing with search, category, price, rating, availability and discount filters, sorting and pagination (all URL-driven)
- Product pages with image gallery, variant selection, stock status, specifications, related and frequently-bought-together products
- Persistent cart (drawer and page), checkout with Indian address validation and UPI / card / net banking / cash on delivery, order confirmation
- INR pricing with Indian number formatting; mobile-first responsive design

## Architecture

The UI never talks to a data source directly:

```
Component → Service (src/lib/services) → CatalogRepository → Medusa Store API
```

- Products, categories, thumbnails and galleries are loaded from the backend.
- Local catalog JSON files and the mock provider have been removed.

See `apps/storefront/src/lib/catalog/README.md` for backend configuration and the Devotional category setup. Older progress documents describe the previous demo catalog.

## Getting started

**Prerequisites:** Node.js 22+, npm 11+, Docker (for PostgreSQL and Redis).

```bash
# 1. Install dependencies (from the repo root)
npm install

# 2. Start PostgreSQL and Redis
docker run -d --name true-shop-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=medusa-true-shop -p 5433:5432 -v true-shop-pgdata:/var/lib/postgresql/data postgres:16
docker run -d --name true-shop-redis -p 6379:6379 redis:7

# 3. Configure environment
cp apps/backend/.env.template apps/backend/.env            # set DATABASE_URL
cp apps/storefront/.env.template apps/storefront/.env.local

# 4. Prepare the database and an admin user
cd apps/backend
npx medusa db:migrate
npx medusa user -e admin@example.com -p <password>
cd ../..

# 5. Run everything
npm run dev
```

- Storefront: http://localhost:8000
- Admin: http://localhost:9000/app

The storefront requires the backend and a configured publishable API key. Category and product changes appear on page refresh. Devotional begins empty until products are assigned in admin.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run backend and storefront |
| `npm run storefront:dev` | Storefront only |
| `npm run backend:dev` | Backend only |
| `npm run build` | Build all apps |
| `npm run lint` | Lint all apps |
| `npm run test` | Backend test suites |

## Deployment

The storefront deploys to Vercel with **Root Directory** set to `apps/storefront` and the environment variables from `apps/storefront/.env.template`.

## Branding

Store name, logo, contact details and commerce settings (currency, shipping thresholds, fees) live in `apps/storefront/src/lib/brand.ts`. Brand colors are defined in `apps/storefront/tailwind.config.js`.
