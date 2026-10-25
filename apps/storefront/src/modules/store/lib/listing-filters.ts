import type { ProductSort } from "@lib/catalog/types"
import { formatPrice } from "@lib/util/format-price"

/**
 * Listing state as it lives in the URL. Param names:
 * q, category, min, max, rating, stock=1, sale=1, sort, page.
 */
export type ListingFilters = {
  q?: string
  category?: string
  min?: number
  max?: number
  rating?: number
  inStock: boolean
  onSale: boolean
  sort: ProductSort
  page: number
}

export const DEFAULT_SORT: ProductSort = "popular"

export const SORT_LABELS: Record<ProductSort, string> = {
  popular: "Popularity",
  newest: "Newest first",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
  rating: "Customer rating",
}

export const RATING_THRESHOLDS = [4, 3] as const

export type PriceBand = { min?: number; max?: number }

export const QUICK_PRICE_BANDS: PriceBand[] = [
  { max: 299 },
  { min: 300, max: 999 },
  { min: 1000, max: 2499 },
  { min: 2500 },
]

export function formatPriceBand({ min, max }: PriceBand) {
  if (min !== undefined && max !== undefined) {
    return `${formatPrice(min)} – ${formatPrice(max)}`
  }
  if (max !== undefined) return `Under ${formatPrice(max)}`
  if (min !== undefined) return `${formatPrice(min)} & above`
  return "Any price"
}

export const EMPTY_FILTERS: ListingFilters = {
  inStock: false,
  onSale: false,
  sort: DEFAULT_SORT,
  page: 1,
}

/** Filters that narrow results (sort and page excluded). */
export function countActiveFilters(filters: ListingFilters) {
  return [
    filters.q,
    filters.category,
    filters.min !== undefined || filters.max !== undefined,
    filters.rating,
    filters.inStock,
    filters.onSale,
  ].filter(Boolean).length
}

export function toSearchString(filters: ListingFilters) {
  const params = new URLSearchParams()

  if (filters.q) params.set("q", filters.q)
  if (filters.category) params.set("category", filters.category)
  if (filters.min !== undefined) params.set("min", String(filters.min))
  if (filters.max !== undefined) params.set("max", String(filters.max))
  if (filters.rating) params.set("rating", String(filters.rating))
  if (filters.inStock) params.set("stock", "1")
  if (filters.onSale) params.set("sale", "1")
  if (filters.sort !== DEFAULT_SORT) params.set("sort", filters.sort)
  if (filters.page > 1) params.set("page", String(filters.page))

  const query = params.toString()
  return query ? `?${query}` : ""
}

/**
 * Builds a listing URL from the current filters plus changes. Any change other
 * than an explicit page jump sends the shopper back to page 1, since the old
 * page number may no longer exist in the new result set.
 */
export function buildListingHref(
  path: string,
  filters: ListingFilters,
  changes: Partial<ListingFilters> = {}
) {
  const next = { ...filters, page: 1, ...changes }
  return `${path}${toSearchString(next)}`
}

export type FilterChip = {
  key: string
  label: string
  changes: Partial<ListingFilters>
}

export function getFilterChips(
  filters: ListingFilters,
  categoryNames: Record<string, string> = {}
): FilterChip[] {
  const chips: FilterChip[] = []

  if (filters.q) {
    chips.push({ key: "q", label: `"${filters.q}"`, changes: { q: undefined } })
  }
  if (filters.category) {
    chips.push({
      key: "category",
      label: categoryNames[filters.category] ?? filters.category,
      changes: { category: undefined },
    })
  }
  if (filters.min !== undefined || filters.max !== undefined) {
    chips.push({
      key: "price",
      label: formatPriceBand({ min: filters.min, max: filters.max }),
      changes: { min: undefined, max: undefined },
    })
  }
  if (filters.rating) {
    chips.push({
      key: "rating",
      label: `${filters.rating}★ & up`,
      changes: { rating: undefined },
    })
  }
  if (filters.inStock) {
    chips.push({ key: "stock", label: "In stock", changes: { inStock: false } })
  }
  if (filters.onSale) {
    chips.push({ key: "sale", label: "On sale", changes: { onSale: false } })
  }

  return chips
}

/** Clears every narrowing filter but keeps the chosen sort order. */
export const clearedFilters = (filters: ListingFilters): ListingFilters => ({
  ...EMPTY_FILTERS,
  sort: filters.sort,
})
