# Catalog data layer

## How data flows

```
component (server) -> @lib/services/{product,category}-service
                   -> catalogRepository (repositories/index.ts)
                   -> MockCatalogRepository   (src/data/*.json)
                    | MedusaCatalogRepository (Medusa Store API)
```

UI code only sees the domain types in `types.ts`. Each repository maps its
provider's payloads into those types, so switching providers never touches
components or services. Repositories are server-only.

## Switching provider

Set `CATALOG_DATA_SOURCE` in `.env.local` and restart the dev server:

| Value            | Source                                      | Extra variables                                                                                     |
| ---------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `mock` (default) | `src/data/products.json`, `categories.json` | none                                                                                                |
| `medusa`         | Medusa Store API                            | `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, optional `MEDUSA_REGION_ID` |

Prices are resolved in a region: `MEDUSA_REGION_ID` if set, otherwise the
first region whose currency is `inr`, otherwise the first region returned.
The storefront formats every price as INR, so the backend needs an INR region
for amounts to be meaningful.

## Adding a provider

1. Create `repositories/<name>.ts` with a class implementing
   `CatalogRepository` (`repositories/types.ts`).
2. Register it in the `repositories` map in `repositories/index.ts`.
3. Document its variables in `.env.template`.

Return `null` for not-found lookups and throw on transport errors.

## Medusa field mapping

| Domain field                           | Medusa source                                                                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `id`, `slug`, `name`                   | `id`, `handle`, `title`                                                                              |
| `categoryId`                           | first of `categories[].id` (empty string when uncategorised)                                         |
| `brand`                                | `metadata.brand`, else `collection.title`, else the store name                                       |
| `shortDescription`                     | `subtitle`, else `metadata.shortDescription`, else first sentence of `description`                   |
| `images`, `thumbnail`                  | `images[]` ordered by `rank`; `thumbnail`, else first image                                          |
| `options`                              | `options[]` (title, values); empty for single-variant products                                       |
| `variants[].options`                   | `variant.options[]` as `{ [option.title]: value }`                                                   |
| `variants[].price`                     | `calculated_price.calculated_amount`, rounded to whole rupees                                        |
| `variants[].compareAtPrice`            | `calculated_price.original_amount` (or `variant.metadata.compareAtPrice`) when higher than the price |
| `variants[].stock`                     | `inventory_quantity`; 999 when `manage_inventory` is off or backorders are allowed                   |
| `price`, `compareAtPrice`              | cheapest variant                                                                                     |
| `stock`                                | sum of variant stock                                                                                 |
| `sku`                                  | `metadata.sku`, else first variant SKU, else handle                                                  |
| `tags`                                 | native `tags[].value` merged with `metadata.tags`                                                    |
| `rating`, `reviewCount`, `salesCount`  | `metadata.*` (number or numeric string), default 0                                                   |
| `specifications`                       | `metadata.specifications` (object or JSON string), default `{}`                                      |
| `features`, `complementaryProductIds`  | `metadata.*` (array, JSON string or comma list), default `[]`                                        |
| `isFeatured`, `isBestSeller`           | `metadata.*` (boolean or `"true"`), default `false`                                                  |
| `isNewArrival`                         | `metadata.isNewArrival`, else created within the last 30 days                                        |
| `createdAt`                            | `created_at`                                                                                         |
| Category `slug`, `name`, `description` | `handle`, `name`, `description`                                                                      |
| Category `shortDescription`, `image`   | `metadata.shortDescription` / first sentence, `metadata.image` (URL)                                 |
| Category `sortOrder`                   | `rank`                                                                                               |
| Category `productCount`                | `count` of `/store/products?category_id[]=<id>&limit=0`                                              |

Metadata keys use the same camelCase names as `src/data/products.json`, so a
seed script can copy them across directly.

## Querying with Medusa

Pushed to the Store API: `search` (`q`), `categoryId` (`category_id`), `ids`
(`id`), slug lookups (`handle`), and pagination when the sort is `newest`
(`order=-created_at`, `limit`/`offset`).

Done in memory, because the Store API has no equivalent: price, rating,
stock, sale and flag filters, `excludeIds`, and the `popular`, `price_*` and
`rating` sorts. For those queries the repository fetches every product
matching the API-side filters in pages of 100, up to 1,000 products (newest
first), then filters, sorts and paginates. If more products match, only the
newest 1,000 are considered and a warning is logged. `getPriceRange` and
`getProductsByIds` use the same bounded fetch.

## Known gaps

- Search relevance comes from Medusa's `q` filter, which matches differently
  from the mock provider's word-by-word match on name, brand, SKU and tags.
- `productCount` costs one count request per category.
- Rating, reviews and sales figures are only as good as the metadata; there
  is no reviews module.
- Variant IDs are real Medusa IDs, but the cart and orders are still local to
  the storefront and do not create Medusa carts.
- Responses are cached by Next.js for 60 seconds (fetch tag `catalog`).
