import "server-only"

import categoriesData from "../../../data/categories.json"
import productsData from "../../../data/products.json"
import type {
  Category,
  PaginatedResult,
  PriceRange,
  Product,
  ProductImage,
  ProductOption,
  ProductQuery,
  ProductSort,
  ProductVariant,
} from "../types"
import type { CatalogRepository } from "./types"

/** Shape of a record in `src/data/products.json`. */
type RawProduct = {
  id: string
  slug: string
  name: string
  categoryId: string
  brand: string
  shortDescription: string
  description: string
  price: number
  compareAtPrice?: number
  currency: string
  images: ProductImage[]
  rating: number
  reviewCount: number
  stock: number
  sku: string
  tags: string[]
  options?: ProductOption[]
  variants?: {
    options: Record<string, string>
    price?: number
    compareAtPrice?: number
    stock: number
    sku?: string
  }[]
  /** Keys vary per product, so JSON inference marks absent ones as undefined. */
  specifications?: Record<string, string | undefined>
  features?: string[]
  isFeatured?: boolean
  isBestSeller?: boolean
  isNewArrival?: boolean
  salesCount?: number
  createdAt: string
  complementaryProductIds?: string[]
}

type RawCategory = Omit<Category, "productCount">

const DEFAULT_PAGE_SIZE = 12

function toVariants(raw: RawProduct): ProductVariant[] {
  if (!raw.variants?.length) {
    return [
      {
        id: `${raw.id}-default`,
        sku: raw.sku,
        options: {},
        price: raw.price,
        compareAtPrice: raw.compareAtPrice,
        stock: raw.stock,
      },
    ]
  }

  return raw.variants.map((variant, index) => ({
    id: `${raw.id}-v${index + 1}`,
    sku: variant.sku ?? `${raw.sku}-${index + 1}`,
    options: variant.options,
    price: variant.price ?? raw.price,
    compareAtPrice: variant.compareAtPrice ?? raw.compareAtPrice,
    stock: variant.stock,
  }))
}

function toProduct(raw: RawProduct): Product {
  const variants = toVariants(raw)
  const cheapest = variants.reduce((min, v) => (v.price < min.price ? v : min))

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    categoryId: raw.categoryId,
    brand: raw.brand,
    shortDescription: raw.shortDescription,
    description: raw.description,
    price: cheapest.price,
    compareAtPrice: cheapest.compareAtPrice,
    currency: raw.currency,
    images: raw.images,
    thumbnail: raw.images[0],
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    stock: variants.reduce((sum, v) => sum + v.stock, 0),
    sku: raw.sku,
    tags: raw.tags,
    options: raw.options ?? [],
    variants,
    specifications: Object.fromEntries(
      Object.entries(raw.specifications ?? {}).filter(
        (entry): entry is [string, string] => Boolean(entry[1])
      )
    ),
    features: raw.features ?? [],
    isFeatured: raw.isFeatured ?? false,
    isBestSeller: raw.isBestSeller ?? false,
    isNewArrival: raw.isNewArrival ?? false,
    salesCount: raw.salesCount ?? 0,
    createdAt: raw.createdAt,
    complementaryProductIds: raw.complementaryProductIds ?? [],
  }
}

const products: Product[] = (productsData as RawProduct[]).map(toProduct)

const categories: Category[] = (categoriesData as RawCategory[])
  .map((category) => ({
    ...category,
    productCount: products.filter((p) => p.categoryId === category.id).length,
  }))
  .sort((a, b) => a.sortOrder - b.sortOrder)

function matchesSearch(product: Product, term: string) {
  const haystack = [
    product.name,
    product.brand,
    product.shortDescription,
    product.sku,
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase()

  return term
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
}

function filterProducts(query: ProductQuery) {
  return products.filter((p) => {
    if (query.categoryId && p.categoryId !== query.categoryId) return false
    if (query.ids && !query.ids.includes(p.id)) return false
    if (query.excludeIds?.includes(p.id)) return false
    if (query.minPrice !== undefined && p.price < query.minPrice) return false
    if (query.maxPrice !== undefined && p.price > query.maxPrice) return false
    if (query.minRating !== undefined && p.rating < query.minRating)
      return false
    if (query.inStockOnly && p.stock <= 0) return false
    if (query.onSaleOnly && !p.compareAtPrice) return false
    if (query.isFeatured && !p.isFeatured) return false
    if (query.isBestSeller && !p.isBestSeller) return false
    if (query.isNewArrival && !p.isNewArrival) return false
    if (query.search && !matchesSearch(p, query.search)) return false
    return true
  })
}

const comparators: Record<ProductSort, (a: Product, b: Product) => number> = {
  popular: (a, b) => b.salesCount - a.salesCount,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
}

export class MockCatalogRepository implements CatalogRepository {
  async listProducts(query: ProductQuery): Promise<PaginatedResult<Product>> {
    const limit = query.limit ?? DEFAULT_PAGE_SIZE
    const page = Math.max(1, query.page ?? 1)
    const filtered = filterProducts(query).sort(
      comparators[query.sort ?? "popular"]
    )
    const start = (page - 1) * limit

    return {
      items: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    }
  }

  async getProductBySlug(slug: string) {
    return products.find((p) => p.slug === slug) ?? null
  }

  async getProductsByIds(ids: string[]) {
    return ids
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p))
  }

  async getPriceRange(categoryId?: string): Promise<PriceRange> {
    const prices = filterProducts({ categoryId }).map((p) => p.price)

    return prices.length
      ? { min: Math.min(...prices), max: Math.max(...prices) }
      : { min: 0, max: 0 }
  }

  async listCategories() {
    return categories
  }

  async getCategoryBySlug(slug: string) {
    return categories.find((c) => c.slug === slug) ?? null
  }
}
