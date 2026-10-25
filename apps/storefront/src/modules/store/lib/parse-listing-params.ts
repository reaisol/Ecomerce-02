import {
  PRODUCT_SORT_OPTIONS,
  type ProductQuery,
  type ProductSort,
} from "@lib/catalog/types"

import type { ListingFilters } from "./listing-filters"

export type ListingSearchParams = Record<string, string | string[] | undefined>

export const LISTING_PAGE_SIZE = 12

const MAX_SEARCH_LENGTH = 100
const MAX_PAGE = 1000
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

function parseWholeNumber(value: string | undefined, max = Infinity) {
  if (!value || !/^\d+$/.test(value)) return undefined
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed <= max ? parsed : undefined
}

const parseFlag = (value: string | undefined) =>
  value === "1" || value === "true"

function parseSort(value: string | undefined): ProductSort {
  return PRODUCT_SORT_OPTIONS.find((option) => option === value) ?? "popular"
}

/**
 * Turns raw URL search params into validated listing filters. Anything
 * malformed is dropped rather than rejected, so hand-edited or stale links
 * still render a sensible page.
 */
export function parseListingParams(params: ListingSearchParams): ListingFilters {
  const search = first(params.q)?.trim().slice(0, MAX_SEARCH_LENGTH)
  const category = first(params.category)?.toLowerCase()
  let min = parseWholeNumber(first(params.min))
  let max = parseWholeNumber(first(params.max))

  if (min !== undefined && max !== undefined && min > max) {
    ;[min, max] = [max, min]
  }

  const rating = parseWholeNumber(first(params.rating), 4)

  return {
    q: search || undefined,
    category: category && SLUG_PATTERN.test(category) ? category : undefined,
    min,
    max,
    rating: rating && rating >= 1 ? rating : undefined,
    inStock: parseFlag(first(params.stock)),
    onSale: parseFlag(first(params.sale)),
    sort: parseSort(first(params.sort)),
    page: Math.max(1, parseWholeNumber(first(params.page), MAX_PAGE) ?? 1),
  }
}

export function toProductQuery(
  filters: ListingFilters,
  categoryId?: string
): ProductQuery {
  return {
    search: filters.q,
    categoryId,
    minPrice: filters.min,
    maxPrice: filters.max,
    minRating: filters.rating,
    inStockOnly: filters.inStock || undefined,
    onSaleOnly: filters.onSale || undefined,
    sort: filters.sort,
    page: filters.page,
    limit: LISTING_PAGE_SIZE,
  }
}
