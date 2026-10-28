# Backend catalog

Products and categories come exclusively from the Medusa Store API. Local
product/category JSON files and the mock repository have been removed.

Set `NEXT_PUBLIC_MEDUSA_BACKEND_URL` and `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
in the storefront environment. The publishable key must have the appropriate
sales channel. `MEDUSA_REGION_ID` optionally selects the pricing region;
otherwise the adapter prefers INR, then the first configured region.

Manage categories in the backend admin: they must be active and public.
Publish products, assign their categories and sales channel, and configure
variant prices and stock. Product images and thumbnails come from the backend.
Category artwork uses an optional `image` URL in category metadata.

Catalog fetches use `no-store`; refreshing the page retrieves backend changes.
Missing images display neutral placeholders. Legacy Wikimedia and Medusa demo
image URLs are suppressed, without deleting backend image records. Upload real
product images to replace them. The supplied suit homepage portrait is still
an editorial asset, separate from product imagery.

Create Devotional idempotently from `apps/backend`:

```sh
npx medusa exec ./src/scripts/ensure-devotional-category.ts
```

The category starts empty. Assign published products to it in the admin to
populate `/in/categories/devotional`. No sample products are inserted.

Optional product metadata supported by the adapter includes `brand`,
`shortDescription`, `rating`, `reviewCount`, `isFeatured`, `isBestSeller`,
`isNewArrival`, `salesCount`, `specifications`, `features`, `tags`, and
`complementaryProductIds`.
