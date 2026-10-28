import { getCategoryBySlug } from "@lib/services/category-service"
import { getPriceRange, listProducts } from "@lib/services/product-service"
import { formatPrice, getDiscountPercent } from "@lib/util/format-price"

import PromoBanner from "./promo-banner"

/** Merchandising slots; the copy is derived from live catalog data so offers stay truthful. */
const KITCHEN_SLUG = "kitchen-dining"
const STORAGE_SLUG = "plastic-storage"

async function getMaxDiscount(categoryId: string) {
  const { items } = await listProducts({
    categoryId,
    onSaleOnly: true,
    limit: Number.MAX_SAFE_INTEGER,
  })
  return Math.max(
    0,
    ...items.map((p) => getDiscountPercent(p.price, p.compareAtPrice)),
  )
}

const PromoBanners = async () => {
  const [kitchen, storage] = await Promise.all([
    getCategoryBySlug(KITCHEN_SLUG),
    getCategoryBySlug(STORAGE_SLUG),
  ])

  const [kitchenDiscount, storagePrices] = await Promise.all([
    kitchen ? getMaxDiscount(kitchen.id) : 0,
    storage ? getPriceRange(storage.id) : null,
  ])

  if (!kitchen && !storage) {
    return null
  }

  return (
    <section aria-label="Offers" className="content-container py-6 small:py-8">
      <div className="grid gap-4 small:grid-cols-2 small:gap-5">
        {kitchen && (
          <PromoBanner
            tone="dark"
            eyebrow={
              kitchenDiscount > 0 ? "Limited-time offer" : "Kitchen & dining"
            }
            title={
              kitchenDiscount > 0
                ? `Up to ${kitchenDiscount}% off kitchen essentials`
                : "Kitchen essentials for every day"
            }
            description={kitchen.shortDescription}
            href={`/categories/${kitchen.slug}`}
            image={kitchen.image}
          />
        )}
        {storage && (
          <PromoBanner
            tone="light"
            eyebrow={
              storagePrices && storagePrices.min > 0
                ? `Starting at ${formatPrice(storagePrices.min)}`
                : storage.name
            }
            title="Smart storage solutions"
            description={storage.shortDescription}
            href={`/categories/${storage.slug}`}
            image={storage.image}
          />
        )}
      </div>
    </section>
  )
}

export default PromoBanners
