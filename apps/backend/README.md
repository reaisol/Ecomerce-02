# trushop backend

Commerce backend for trushop: products, inventory, pricing, carts, orders, customers and the admin dashboard.

- Runtime: Node.js 20+, PostgreSQL 15+, Redis
- API: Store API (`/store/*`) for the storefront, Admin API (`/admin/*`) and admin UI at `/app`
- Config: `medusa-config.ts`, environment in `.env` (see `.env.template`)

## Run locally

```bash
cp .env.template .env        # set DATABASE_URL
npx medusa db:migrate
npx medusa user -e admin@example.com -p <password>
npm run dev                  # http://localhost:9000
```

## Source layout

| Path | Purpose |
|---|---|
| `src/api` | Custom HTTP routes (file-based: `src/api/store/<path>/route.ts`) |
| `src/workflows` | Business logic as workflows and steps |
| `src/modules` | Custom modules (models, services, migrations) |
| `src/links` | Links between modules |
| `src/subscribers` | Event handlers |
| `src/jobs` | Scheduled jobs |
| `src/admin` | Admin dashboard extensions |
| `src/migration-scripts` | Data seeding / migration scripts |

See `CONTRIBUTING.md` at the repo root for conventions and commands, and `docs/tool-shop-progress.md` for the backend roadmap.
