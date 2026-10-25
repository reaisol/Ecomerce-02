# trushop: Progress & Next Steps

Last updated: 2026-10-25
Branch: `feature/tool-shop-rebrand` (created from `main`, **not committed yet**)

This file records what was done in the frontend transformation and what is left, so work can resume from here (next up: backend).

---

## 1. Current status: frontend demo ready

The storefront (`apps/storefront`) is a branded Indian e-commerce store, **trushop** (trushop.com):

- Official logo, with colors sampled from it: brand blue `#006DB0`, ink `#131A24`
- Mobile-first, INR pricing
- Catalog served from JSON data (30 products)

Checks run at the end:

- `tsc` clean, `next lint` clean
- All 30 product pages and 5 category pages return 200
- No console errors or horizontal overflow at 390px and 1440px
- All 54 image URLs return 200

### How to run

```bash
# From repo root
docker start true-shop-postgres true-shop-redis    # backend DB (Postgres on 5433) + Redis
npm run dev                                         # backend :9000 + storefront :8000
# Storefront: http://localhost:8000/in
# Admin:      http://localhost:9000/app   (admin@test.com / supersecret)
```

Notes:

- The storefront runs without the backend. Only the `/account` pages need it.
- Global `~/.npmrc` points at an expired private registry. Install with `npm install --registry=https://registry.npmjs.org/`.
- `apps/storefront/next.config.js`: removed a webpack alias that forced `react` to a separate copy. It broke App Router rendering with "Objects are not valid as a React child".

---

## 2. What was built

### Architecture: UI never touches JSON

```
Component → Service (src/lib/services/*) → CatalogRepository → Mock (JSON) | Medusa (API)
```

| Layer | Location |
|---|---|
| Domain types (Product, Variant, Category, ProductQuery, sorts) | `src/lib/catalog/types.ts` |
| Repository contract | `src/lib/catalog/repositories/types.ts` |
| JSON provider (default) | `src/lib/catalog/repositories/mock.ts` → `src/data/products.json`, `categories.json` |
| Medusa API provider | `src/lib/catalog/repositories/medusa.ts` (see `src/lib/catalog/README.md`) |
| Provider switch | `src/lib/catalog/repositories/index.ts`, env `CATALOG_DATA_SOURCE=mock\|medusa` |
| Services | `src/lib/services/product-service.ts`, `category-service.ts` |
| Cart (client, localStorage, cross-tab) | `src/lib/cart/*` (`useCart`, `cartActions`, `toCartLine`, totals) |
| Orders (client, localStorage) | `src/lib/orders/*` (`orderService`, `OrderRepository` interface, payment methods, Indian states) |
| Brand & commerce config | `src/lib/brand.ts` (name "trushop", logo paths, contact, currency, shipping ₹49 / free ≥ ₹499, COD fee ₹25) |
| Price formatting | `src/lib/util/format-price.ts` (₹ with Indian digit grouping) |
| Theme tokens | `apps/storefront/tailwind.config.js` (`brand-*`, `navy-*`, `surface-*`, shadows, fonts) |

### Features

- **Header**:
  - Top bar
  - Logo
  - Search
  - Account
  - Cart with count badge (opens the cart drawer)
  - Category nav
  - Mobile slide-over menu
- **Footer**:
  - Categories
  - Customer care
  - Contact
  - Payment badges
- **Homepage**:
  - Hero with product collage
  - Category cards
  - Featured / Best sellers / Today's deals / New arrivals rails
  - Promo banners (figures computed from data)
  - Why shop with us
- **Listing** (`/store`, `/categories/<slug>`):
  - URL-driven search and filters: category, price range, rating, in stock, on sale
  - Sort: popular, newest, price ↑/↓, rating
  - Pagination
  - Filter chips
  - Mobile filter sheet
  - Empty and error states
  - Query parameters: `q`, `category`, `min`, `max`, `rating`, `stock=1`, `sale=1`, `sort`, `page`
- **Product page**:
  - Gallery with image credits (required by the CC licenses)
  - Variant selector (`?variant=<id>`)
  - Stock status
  - Quantity selector
  - Add to cart, Buy now
  - Sticky mobile purchase bar
  - Delivery and returns info
  - Description, features, specifications, tags
  - Frequently bought together
  - Related products
- **Cart**: drawer and `/cart` page, MRP / discount / delivery breakdown, free-delivery progress bar, persists across reloads.
- **Checkout** (`/checkout`, demo, no real payment):
  - Contact details and Indian address (state list, pincode and mobile validation)
  - Payment method: UPI / card / net banking / COD
  - Inline validation
  - Order summary
- **Order confirmation** (`/order/<id>/confirmed`): order number, estimated delivery, address, items, totals.
- **Help page** (`/help`): shipping, returns, payments, contact.
- **Branded 404 pages.**
- **Rebranding**:
  - Removed: Medusa / "trushop" / EUR / Denmark references, onboarding CTAs, collections, the old instantsearch search, Stripe checkout UI, the order-transfer flow.
  - Middleware serves only `/in` and no longer calls the backend.

### Catalog data (`apps/storefront/src/data`)

- **Categories:** 5, with 6 products each:
  - `kitchen-dining`
  - `plastic-storage`
  - `cleaning-household`
  - `home-utility`
  - `tools-imported`
- **Product fields:** realistic INR pricing, compare-at prices, ratings and reviews, SKUs (`TS-KD-001`…), options and variants with their own stock, specifications, features, tags, complementary products, featured / bestseller / new-arrival flags.
- **Images:** openly licensed from Wikimedia Commons (CC BY / BY-SA / CC0 / public domain), with author / license / source credits stored per image. 19 products have 2 images and 11 have 1.
- **Stock:** out of stock: `prd-0007` and `prd-0029`. Low stock: `prd-0012`, `prd-0015`, `prd-0023`.
- **Product swaps:** a few product types were swapped for ones with usable photos, e.g. a tailor's measuring tape instead of a steel tape, and a spin mop refill head instead of a full spin mop.

---

## 3. Known gaps (frontend)

- [x] **Logo & colors:**
  - The official logo is integrated as `public/brand/trushop-mark.png` (bag icon, transparent) and `trushop-logo.png` (full).
  - Header / footer / checkout show the icon plus a "tru"(blue) + "shop"(ink) wordmark. On the dark footer the icon sits on a white tile, because its white check would vanish there.
  - The favicon, apple icon and share images are generated from the logo.
  - The palette in `tailwind.config.js` is sampled from the logo.
- [ ] **Vector logo:** get an SVG version of the logo from the designer to replace the PNG crop.
- [ ] **404 status:** unknown product/category URLs show the not-found page but return HTTP **200**, not 404, because the `loading.tsx` on those routes starts streaming first. To fix, drop or restructure those `loading.tsx` files.
- [ ] **Image quality:** some photos are user-shot rather than studio product shots. Replace them with real product photography when available.
- [ ] **Account area** (`/account`) is still the original login / orders UI. It's only lightly re-skinned and needs the backend running. Demo orders, kept in localStorage, do not appear there.
- [ ] **Orders** exist only in the browser that placed them.
- [ ] **Unused dependencies:** `@stripe/*` and `react-instantsearch` / `@medusajs/instantsearch-adapter` are still in `package.json`. Remove them when installing is possible.
- [ ] Make a 768px (tablet) visual pass. Tablet currently uses the mobile layout below 1024px.

---

## 4. Next steps: backend (planned for tomorrow)

1. **Region & currency**:
   - Create an **India region with INR** in Medusa. Today only "Europe / EUR" exists.
   - Set `MEDUSA_REGION_ID` or rely on the adapter picking the INR region automatically.
2. **Schema for Tool Shop data in Medusa**:
   - Products: `handle` = slug, `title` = name, `subtitle` = short description, options and variants with prices in INR, and inventory per variant.
   - Fields with no native Medusa equivalent go in `product.metadata`, using the same keys as `products.json`: `brand`, `rating`, `reviewCount`, `salesCount`, `specifications`, `features`, `tags`, `isFeatured`, `isBestSeller`, `isNewArrival`, `complementaryProductIds`. Variant `compareAtPrice` goes in `variant.metadata` or a price list.
   - Categories: `handle` = slug, `rank` = sortOrder, `metadata.image`.
   - The full mapping table is in `apps/storefront/src/lib/catalog/README.md`.
3. **Seed script:**
   - Write `apps/backend/src/scripts/seed-tool-shop.ts` to import `apps/storefront/src/data/*.json`.
   - Also remove the 4 sample apparel products currently in the database.
4. **Switch the catalog:** set `CATALOG_DATA_SOURCE=medusa` in `apps/storefront/.env.local` and re-test every page. Search, price and rating filters run in memory inside the adapter, capped at 1,000 products; see the README.
5. **Cart → Medusa cart:**
   - Keep the `useCart` API.
   - Change the cart store's persistence (`src/lib/cart/cart-store.ts`) to create and update a Medusa cart by id, so the UI stays unchanged.
6. **Orders → Medusa:**
   - Add a backend `OrderRepository` implementation (create cart, set address, shipping and payment, complete).
   - Switch `orderService` to it.
   - Map payment methods: Razorpay for UPI / card / net banking, plus manual COD.
7. **Auth / account:** restyle the account pages to the new design and show the customer's Medusa orders.
8. **Infra:**
   - Postgres runs in Docker `true-shop-postgres` on port **5433**, because 5432 is used by another project.
   - Database `medusa-true-shop`, configured in `apps/backend/.env` (not committed).
9. **Commit / PR:** nothing has been committed yet. Review the diff (`git status`), then commit on `feature/tool-shop-rebrand`.
