import "server-only"

import { listProducts } from "@lib/services/product-service"

export type StoreStats = {
  productCount: number
  reviewCount: number
  /** Review-weighted average across the catalog, 0 when there are no reviews. */
  averageRating: number
}

/** Catalog-wide figures for trust messaging, so the homepage never claims numbers it can't back. */
export async function getStoreStats(): Promise<StoreStats> {
  const { items, total } = await listProducts({
    limit: Number.MAX_SAFE_INTEGER,
  })

  const reviewCount = items.reduce((sum, p) => sum + p.reviewCount, 0)
  const weightedRating = items.reduce(
    (sum, p) => sum + p.rating * p.reviewCount,
    0
  )

  return {
    productCount: total,
    reviewCount,
    averageRating: reviewCount > 0 ? weightedRating / reviewCount : 0,
  }
}
