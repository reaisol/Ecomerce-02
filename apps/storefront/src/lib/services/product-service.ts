import "server-only"

import { cache } from "react"

import { catalogRepository } from "@lib/catalog/repositories"
import type { Product, ProductQuery } from "@lib/catalog/types"

const RAIL_SIZE = 8

export const listProducts = async (query: ProductQuery = {}) => {
  try {
    return await catalogRepository.listProducts(query)
  } catch (error) {
    console.warn("Failed to list products from catalog:", error)
    return {
      items: [],
      total: 0,
      page: query.page ?? 1,
      limit: query.limit ?? 12,
      totalPages: 0,
    }
  }
}

export const getProductBySlug = cache(async (slug: string) => {
  try {
    return await catalogRepository.getProductBySlug(slug)
  } catch (error) {
    console.warn(`Failed to get product by slug "${slug}":`, error)
    return null
  }
})

export const getPriceRange = async (categoryId?: string) => {
  try {
    return await catalogRepository.getPriceRange(categoryId)
  } catch (error) {
    console.warn("Failed to get price range:", error)
    return { min: 0, max: 0 }
  }
}

async function rail(query: ProductQuery) {
  try {
    const { items } = await catalogRepository.listProducts({
      limit: RAIL_SIZE,
      ...query,
    })
    return items
  } catch (error) {
    console.warn("Failed to load product rail items:", error)
    return []
  }
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
  try {
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
  } catch (error) {
    console.warn("Failed to load frequently bought together products:", error)
    return []
  }
}
