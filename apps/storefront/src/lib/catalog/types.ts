/**
 * Storefront domain model for the catalog.
 *
 * UI code depends only on these types. Each data source (local JSON today,
 * the commerce backend later) maps its own payloads into this shape inside
 * its repository, so components never see a provider-specific format.
 */

export type ImageCredit = {
  author: string
  license: string
  sourceUrl: string
}

export type ProductImage = {
  url: string
  alt: string
  credit?: ImageCredit
}

export type ProductOption = {
  name: string
  values: string[]
}

export type ProductVariant = {
  id: string
  sku: string
  /** Selected value per option name, e.g. { Color: "Blue", Size: "Large" }. */
  options: Record<string, string>
  price: number
  compareAtPrice?: number
  stock: number
}

export type Product = {
  id: string
  slug: string
  name: string
  categoryId: string
  brand: string
  shortDescription: string
  description: string
  /** Lowest variant price, in whole rupees. */
  price: number
  compareAtPrice?: number
  currency: string
  images: ProductImage[]
  thumbnail?: ProductImage
  rating: number
  reviewCount: number
  /** Total stock across all variants. */
  stock: number
  sku: string
  tags: string[]
  options: ProductOption[]
  /** Always contains at least one variant; single-variant products have no options. */
  variants: ProductVariant[]
  specifications: Record<string, string>
  features: string[]
  isFeatured: boolean
  isBestSeller: boolean
  isNewArrival: boolean
  salesCount: number
  createdAt: string
  complementaryProductIds: string[]
}

export type Category = {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  image?: ProductImage
  sortOrder: number
  productCount: number
}

export const PRODUCT_SORT_OPTIONS = [
  "popular",
  "newest",
  "price_asc",
  "price_desc",
  "rating",
] as const

export type ProductSort = (typeof PRODUCT_SORT_OPTIONS)[number]

export type ProductQuery = {
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStockOnly?: boolean
  onSaleOnly?: boolean
  ids?: string[]
  excludeIds?: string[]
  isFeatured?: boolean
  isBestSeller?: boolean
  isNewArrival?: boolean
  sort?: ProductSort
  page?: number
  limit?: number
}

export type PaginatedResult<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type PriceRange = {
  min: number
  max: number
}
