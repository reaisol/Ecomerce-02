import "server-only"

import { cache } from "react"

import { catalogRepository } from "@lib/catalog/repositories"
import type { Product, ProductQuery } from "@lib/catalog/types"

const RAIL_SIZE = 8

export const listProducts = (query: ProductQuery = {}) =>
  catalogRepository.listProducts(query)

export const getProductBySlug = cache((slug: string) =>
  catalogRepository.getProductBySlug(slug)
)

export const getPriceRange = (categoryId?: string) =>
  catalogRepository.getPriceRange(categoryId)

async function rail(query: ProductQuery) {
  const { items } = await catalogRepository.listProducts({
    limit: RAIL_SIZE,
    ...query,
  })
  return items
}

export const getFeaturedProducts = () =>
  rail({ isFeatured: true, sort: "popular" })

export const getBestSellers = () =>
  rail({ isBestSeller: true, sort: "popular" })

export const getNewArrivals = () => rail({ isNewArrival: true, sort: "newest" })

export const getDealProducts = () => rail({ onSaleOnly: true, sort: "popular" })

export const getRelatedProducts = (product: Product, limit = RAIL_SIZE) =>
  rail({
    categoryId: product.categoryId,
    excludeIds: [product.id],
    sort: "popular",
    limit,
  })

/**
 * Curated complements first, topped up with popular in-stock items from
 * other categories so the section is never empty.
 */
export async function getFrequentlyBoughtTogether(product: Product, limit = 3) {
  const curated = (
    await catalogRepository.getProductsByIds(product.complementaryProductIds)
  ).filter((p) => p.stock > 0)

  if (curated.length >= limit) {
    return curated.slice(0, limit)
  }

  const { items: fillers } = await catalogRepository.listProducts({
    excludeIds: [product.id, ...curated.map((p) => p.id)],
    inStockOnly: true,
    sort: "popular",
    limit: limit * 3,
  })

  return [
    ...curated,
    ...fillers.filter((p) => p.categoryId !== product.categoryId),
  ].slice(0, limit)
}
