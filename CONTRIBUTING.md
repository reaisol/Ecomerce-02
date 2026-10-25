# Contributing to trushop

## Overview

trushop is a Turborepo workspace monorepo containing the commerce backend (`apps/backend`, Node 20+, PostgreSQL 15+) and the Next.js storefront (`apps/storefront`).

## Directory Structure

```text
.
├── apps/
│   ├── backend/                  # Commerce backend (@dtc/backend)
│   │   ├── medusa-config.ts      # Medusa config: DB URL, CORS, secrets, modules
│   │   ├── integration-tests/    # setup.js (Jest setupFiles) and http/*.spec.ts suites
│   │   └── src/
│   │       ├── admin/            # Admin dashboard extensions (widgets/, i18n/, routes)
│   │       ├── api/              # API routes: api/store/*, api/admin/* (file-based)
│   │       ├── jobs/             # Scheduled jobs
│   │       ├── links/            # Module links between modules
│   │       ├── migration-scripts/# Data migration scripts (e.g. initial-data-seed.ts)
│   │       ├── modules/          # Custom modules (service + models + migrations)
│   │       ├── subscribers/      # Event subscribers
│   │       └── workflows/        # Workflows and workflow steps
│   └── storefront/               # Next.js storefront (@dtc/storefront)
│       └── src/
│           ├── app/              # Routes under [countryCode] (India: /in)
│           ├── data/             # Bundled JSON catalog (products, categories)
│           ├── lib/              # brand config, catalog repositories, services, cart, orders
│           └── modules/          # UI modules (layout, home, store, products, cart, checkout, order, account)
├── eslint.config.ts              # Root ESLint: @medusajs/eslint-plugin recommended
├── turbo.json                    # Task graph: build, dev, start, lint, test, seed
```


## Package Manager

The repo uses **npm workspaces** (`package-lock.json` at the root). Use npm for every command and never introduce a second lockfile. Per-app commands below `cd` into the app.

## Commands

Run from the repo root unless noted. 

### Development

```bash
npm run dev                # all apps
npm run backend:dev        # backend only (http://localhost:9000, admin at /app)
npm run storefront:dev     # storefront only (http://localhost:8000)
```

### Build

```bash
npm run build              # all apps
npm run start              # build (via turbo dependsOn) then start
```

### Lint

```bash
npm run lint                          # all apps via turbo
cd apps/backend && npm run lint       # medusa lint
cd apps/storefront && npm run lint    # next lint
```

### Test (backend only; the storefront has no test suite)

```bash
npm run test                                              # all test tasks via turbo
cd apps/backend && npm run test:unit                      # **/src/**/__tests__/**/*.unit.spec.ts
cd apps/backend && npm run test:integration:modules       # **/src/modules/*/__tests__/**
cd apps/backend && npm run test:integration:http          # **/integration-tests/http/*.spec.ts
```

Single test — pass a path/pattern through to Jest, keeping `TEST_TYPE`:

```bash
cd apps/backend && npm run test:unit -- src/modules/foo/__tests__/service.unit.spec.ts
cd apps/backend && npm run test:unit -- -t "returns the cart"
```

### Database

```bash
cd apps/backend
npx medusa db:generate <module-name>   # generate migrations for a custom module
npx medusa db:migrate                  # run migrations
npx medusa user -e admin@test.com -p supersecret
npm run backend:seed                        # from root; seeds initial data
```

## Code Style

- **The backend must satisfy `@medusajs/eslint-plugin`'s recommended config** (`eslint.config.ts`). Its rules encode Medusa framework requirements — correct route/workflow/module shapes, not just cosmetics — so a lint failure usually means the code is actually wrong, not just badly formatted. Never disable a `@medusajs/*` rule to make lint pass; fix the code.
- No semicolons. Double quotes, 2-space indent.
- Files: kebab-case. Types/classes: PascalCase. Functions/variables: camelCase. DB columns: snake_case.
- No emojis in code, comments, or commit messages.

## Conventions

- **Backend routing is file-based.** A store endpoint is `src/api/store/<path>/route.ts` exporting `GET`/`POST`/etc. Don't add a router or register routes manually.
- **Business logic belongs in workflows**, not in route handlers. Routes resolve and run a workflow; workflows compose steps.
- Adding a task to `turbo.json` requires declaring its `outputs`, or Turbo will cache nothing/the wrong thing.

## Common Mistakes

- Running a command that creates a second lockfile (pnpm/yarn).
- Installing a dependency at the root instead of inside the app that needs it (`cd apps/backend && npm install <pkg>`).
- Editing a custom module's model without running `npx medusa db:generate <module>` — the migration is missing and the change silently never applies.
- Writing raw SQL or importing DB clients directly in the backend instead of going through module services / workflows.
- Importing `src/data/*.json` from UI code. Components go through `src/lib/services`; only the catalog repository reads the JSON.
- Using `CATALOG_DATA_SOURCE=medusa` without `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`; requests fail with a publishable-key error, not an obvious 401.
- Running the test task without a reachable PostgreSQL — integration suites need a live DB.
- Silencing `@medusajs/*` ESLint rules instead of fixing the underlying pattern.

## Off-Limits

- `apps/backend/.medusa/`, `.next/`, `dist/`, `out/`, `.turbo/` — build output, excluded from the workspace and regenerated.
- The lockfile (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json` — whichever this install produced) — never hand-edit or delete; change it only as a side effect of a package manager command.
- `.env` / `.env.local` — never commit, print, or copy secret values out of them. Edit `.env.template` instead when documenting a new variable.
- Existing migrations in `src/modules/*/migrations/` — add a new migration rather than rewriting one that may already have run.
- Don't run destructive DB commands (drops, `db:migrate --help`-style flags that reset state) against the user's database without explicit confirmation.
