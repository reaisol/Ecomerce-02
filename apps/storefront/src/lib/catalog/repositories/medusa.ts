import "server-only"

import { brand } from "@lib/brand"
import type { HttpTypes } from "@medusajs/types"

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

type MedusaProduct = HttpTypes.StoreProduct
type MedusaVariant = HttpTypes.StoreProductVariant
type MedusaCategory = HttpTypes.StoreProductCategory
type Metadata = Record<string, unknown> | null | undefined

export type MedusaCatalogOptions = {
  baseUrl: string
  publishableKey: string
  /** Pins the pricing region; otherwise an INR region, else the first one. */
  regionId?: string
}

const DEFAULT_PAGE_SIZE = 12
const SCAN_PAGE_SIZE = 100
/** Upper bound for queries that must be filtered or sorted in memory. */
const MAX_SCAN = 1000
/** Stock reported for variants whose inventory Medusa does not track. */
const UNTRACKED_STOCK = 999
const NEW_ARRIVAL_DAYS = 30
const REVALIDATE_SECONDS = 60

const PRODUCT_FIELDS = [
  "*variants.calculated_price",
  "+variants.inventory_quantity",
  "+variants.metadata",
  "+metadata",
  "*categories",
].join(",")

const CATEGORY_FIELDS =
  "id,handle,name,description,rank,metadata,parent_category_id"

const comparators: Record<ProductSort, (a: Product, b: Product) => number> = {
  popular: (a, b) => b.salesCount - a.salesCount,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
}

function metaString(meta: Metadata, key: string) {
  const value = meta?.[key]
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function metaNumber(meta: Metadata, key: string) {
  const value = Number(meta?.[key])
  return meta?.[key] !== undefined && Number.isFinite(value) ? value : undefined
}

function metaBoolean(meta: Metadata, key: string) {
  const value = meta?.[key]
  if (typeof value === "boolean") return value
  if (value === "true" || value === "false") return value === "true"
  return undefined
}

/** Admin-edited metadata is often a JSON string rather than a nested value. */
function metaJson(meta: Metadata, key: string): unknown {
  const value = meta?.[key]
  if (typeof value !== "string") return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function metaStringList(meta: Metadata, key: string): string[] {
  const value = metaJson(meta, key)
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

function metaRecord(meta: Metadata, key: string): Record<string, string> {
  const value = metaJson(meta, key)
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value).map(([name, item]) => [name, String(item)])
  )
}

function firstSentence(text: string) {
  const match = text.match(/^.*?[.!?](\s|$)/)
  return (match ? match[0] : text).trim()
}

function toImages(product: MedusaProduct): ProductImage[] {
  const images = [...(product.images ?? [])].sort(
    (a, b) => (a.rank ?? 0) - (b.rank ?? 0)
  )
  return images.map((image, index) => ({
    url: image.url,
    alt: index === 0 ? product.title : `${product.title} - image ${index + 1}`,
  }))
}

function toStock(variant: MedusaVariant) {
  if (!variant.manage_inventory || variant.allow_backorder) {
    return UNTRACKED_STOCK
  }
  return Math.max(0, variant.inventory_quantity ?? 0)
}

function toVariant(
  variant: MedusaVariant,
  hasOptions: boolean
): ProductVariant {
  const price = variant.calculated_price
  const amount = Math.round(price?.calculated_amount ?? 0)
  const original = Math.round(
    price?.original_amount ??
      metaNumber(variant.metadata, "compareAtPrice") ??
      0
  )

  return {
    id: variant.id,
    sku: variant.sku ?? variant.id,
    options: hasOptions
      ? Object.fromEntries(
          (variant.options ?? []).map((value) => [
            value.option?.title ?? value.option_id ?? "Option",
            value.value,
          ])
        )
      : {},
    price: amount,
    compareAtPrice: original > amount ? original : undefined,
    stock: toStock(variant),
  }
}

function toOptions(product: MedusaProduct): ProductOption[] {
  return (product.options ?? []).map((option) => ({
    name: option.title,
    values: (option.values ?? []).map((value) => value.value),
  }))
}

function isRecent(createdAt: string) {
  const ageMs = Date.now() - new Date(createdAt).getTime()
  return ageMs <= NEW_ARRIVAL_DAYS * 24 * 60 * 60 * 1000
}

function toProduct(product: MedusaProduct, currency: string): Product {
  const meta = product.metadata
  // Medusa gives single-variant products a placeholder "Default option".
  const hasOptions = (product.variants?.length ?? 0) > 1
  const variants = (product.variants ?? []).map((variant) =>
    toVariant(variant, hasOptions)
  )
  const cheapest = variants.length
    ? variants.reduce((min, v) => (v.price < min.price ? v : min))
    : undefined
  const images = toImages(product)
  const description = product.description ?? ""
  const createdAt = String(product.created_at ?? new Date(0).toISOString())
  const nativeTags = (product.tags ?? []).map((tag) => tag.value)

  return {
    id: product.id,
    slug: product.handle,
    name: product.title,
    categoryId: product.categories?.[0]?.id ?? "",
    brand: metaString(meta, "brand") ?? product.collection?.title ?? brand.name,
    shortDescription:
      product.subtitle ??
      metaString(meta, "shortDescription") ??
      firstSentence(description),
    description,
    price: cheapest?.price ?? 0,
    compareAtPrice: cheapest?.compareAtPrice,
    currency:
      product.variants?.[0]?.calculated_price?.currency_code?.toUpperCase() ??
      currency,
    images,
    thumbnail: product.thumbnail
      ? { url: product.thumbnail, alt: product.title }
      : images[0],
    rating: metaNumber(meta, "rating") ?? 0,
    reviewCount: metaNumber(meta, "reviewCount") ?? 0,
    stock: variants.reduce((sum, v) => sum + v.stock, 0),
    sku: metaString(meta, "sku") ?? variants[0]?.sku ?? product.handle,
    tags: Array.from(new Set([...nativeTags, ...metaStringList(meta, "tags")])),
    options: hasOptions ? toOptions(product) : [],
    variants,
    specifications: metaRecord(meta, "specifications"),
    features: metaStringList(meta, "features"),
    isFeatured: metaBoolean(meta, "isFeatured") ?? false,
    isBestSeller: metaBoolean(meta, "isBestSeller") ?? false,
    isNewArrival: metaBoolean(meta, "isNewArrival") ?? isRecent(createdAt),
    salesCount: metaNumber(meta, "salesCount") ?? 0,
    createdAt,
    complementaryProductIds: metaStringList(meta, "complementaryProductIds"),
  }
}

/** Filters the Store API cannot apply, evaluated over mapped products. */
function matchesLocalFilters(product: Product, query: ProductQuery) {
  if (query.excludeIds?.includes(product.id)) return false
  if (query.minPrice !== undefined && product.price < query.minPrice)
    return false
  if (query.maxPrice !== undefined && product.price > query.maxPrice)
    return false
  if (query.minRating !== undefined && product.rating < query.minRating)
    return false
  if (query.inStockOnly && product.stock <= 0) return false
  if (query.onSaleOnly && !product.compareAtPrice) return false
  if (query.isFeatured && !product.isFeatured) return false
  if (query.isBestSeller && !product.isBestSeller) return false
  if (query.isNewArrival && !product.isNewArrival) return false
  return true
}

/** True when the API alone can answer the query, including its pagination. */
function isApiOnly(query: ProductQuery) {
  return (
    query.sort === "newest" &&
    !query.excludeIds?.length &&
    query.minPrice === undefined &&
    query.maxPrice === undefined &&
    query.minRating === undefined &&
    !query.inStockOnly &&
    !query.onSaleOnly &&
    !query.isFeatured &&
    !query.isBestSeller &&
    !query.isNewArrival
  )
}

function paginate<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}

export class MedusaCatalogRepository implements CatalogRepository {
  private region?: Promise<HttpTypes.StoreRegion>

  constructor(private readonly options: MedusaCatalogOptions) {}

  async listProducts(query: ProductQuery): Promise<PaginatedResult<Product>> {
    const limit = query.limit ?? DEFAULT_PAGE_SIZE
    const page = Math.max(1, query.page ?? 1)
    const params = this.toApiParams(query)

    if (isApiOnly(query)) {
      const { products, count } = await this.fetchProducts({
        ...params,
        order: "-created_at",
        limit: String(limit),
        offset: String((page - 1) * limit),
      })
      return paginate(products, count, page, limit)
    }

    const matching = (await this.scanProducts(params))
      .filter((product) => matchesLocalFilters(product, query))
      .sort(comparators[query.sort ?? "popular"])
    const start = (page - 1) * limit

    return paginate(
      matching.slice(start, start + limit),
      matching.length,
      page,
      limit
    )
  }

  async getProductBySlug(slug: string) {
    const { products } = await this.fetchProducts({ handle: slug, limit: "1" })
    return products[0] ?? null
  }

  async getProductsByIds(ids: string[]) {
    if (!ids.length) return []
    const products = await this.scanProducts({ "id[]": ids })
    return ids
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is Product => Boolean(product))
  }

  async getPriceRange(categoryId?: string): Promise<PriceRange> {
    const prices = (
      await this.scanProducts(categoryId ? { "category_id[]": categoryId } : {})
    ).map((product) => product.price)

    return prices.length
      ? { min: Math.min(...prices), max: Math.max(...prices) }
      : { min: 0, max: 0 }
  }

  async listCategories() {
    const { product_categories } = await this.request<{
      product_categories: MedusaCategory[]
    }>("/store/product-categories", {
      fields: CATEGORY_FIELDS,
      limit: String(MAX_SCAN),
    })
    const categories = await Promise.all(
      product_categories.map((category) => this.toCategory(category))
    )
    return categories.sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async getCategoryBySlug(slug: string) {
    const { product_categories } = await this.request<{
      product_categories: MedusaCategory[]
    }>("/store/product-categories", {
      fields: CATEGORY_FIELDS,
      handle: slug,
      limit: "1",
    })
    return product_categories[0] ? this.toCategory(product_categories[0]) : null
  }

  private toApiParams(query: ProductQuery) {
    const params: Record<string, string | string[]> = {}
    if (query.search?.trim()) params.q = query.search.trim()
    if (query.categoryId) params["category_id[]"] = query.categoryId
    if (query.ids?.length) params["id[]"] = query.ids
    return params
  }

  private async toCategory(category: MedusaCategory): Promise<Category> {
    const meta = category.metadata
    const imageUrl = metaString(meta, "image")
    const description = category.description ?? ""
    const { count } = await this.request<{ count: number }>("/store/products", {
      "category_id[]": category.id,
      limit: "0",
    })

    return {
      id: category.id,
      slug: category.handle,
      name: category.name,
      shortDescription:
        metaString(meta, "shortDescription") ?? firstSentence(description),
      description,
      image: imageUrl ? { url: imageUrl, alt: category.name } : undefined,
      sortOrder: category.rank ?? 0,
      productCount: count,
    }
  }

  /** Fetches every product matching the API-side filters, up to MAX_SCAN. */
  private async scanProducts(params: Record<string, string | string[]>) {
    const products: Product[] = []
    let total = Infinity

    while (products.length < Math.min(total, MAX_SCAN)) {
      const batch = await this.fetchProducts({
        ...params,
        order: "-created_at",
        limit: String(SCAN_PAGE_SIZE),
        offset: String(products.length),
      })
      total = batch.count
      products.push(...batch.products)
      if (!batch.products.length) break
    }

    if (total > MAX_SCAN) {
      console.warn(
        `[catalog] Medusa query matched ${total} products; only the newest ${MAX_SCAN} were filtered and sorted.`
      )
    }
    return products
  }

  private async fetchProducts(params: Record<string, string | string[]>) {
    const region = await this.getRegion()
    const { products, count } = await this.request<{
      products: MedusaProduct[]
      count: number
    }>("/store/products", {
      ...params,
      fields: PRODUCT_FIELDS,
      region_id: region.id,
    })
    const currency = region.currency_code.toUpperCase()

    return {
      products: products.map((product) => toProduct(product, currency)),
      count,
    }
  }

  private getRegion() {
    this.region ??= this.resolveRegion().catch((error) => {
      this.region = undefined
      throw error
    })
    return this.region
  }

  private async resolveRegion() {
    const { regions } = await this.request<{
      regions: HttpTypes.StoreRegion[]
    }>("/store/regions", { limit: "100" })
    const region = this.options.regionId
      ? regions.find((r) => r.id === this.options.regionId)
      : regions.find((r) => r.currency_code === "inr") ?? regions[0]

    if (!region) {
      throw new Error(
        this.options.regionId
          ? `Medusa region "${this.options.regionId}" was not found`
          : "Medusa has no regions configured; prices cannot be calculated"
      )
    }
    return region
  }

  private async request<T>(
    path: string,
    params: Record<string, string | string[]>
  ): Promise<T> {
    const url = new URL(path, this.options.baseUrl)
    for (const [key, value] of Object.entries(params)) {
      for (const item of [value].flat()) url.searchParams.append(key, item)
    }

    let response: Response
    try {
      response = await fetch(url, {
        headers: { "x-publishable-api-key": this.options.publishableKey },
        next: { revalidate: REVALIDATE_SECONDS, tags: ["catalog"] },
      })
    } catch (error) {
      throw new Error(`Medusa catalog request failed: GET ${url.pathname}`, {
        cause: error,
      })
    }

    if (!response.ok) {
      const body = await response.text()
      throw new Error(
        `Medusa catalog request failed: GET ${url.pathname} responded ${
          response.status
        } ${body.slice(0, 200)}`
      )
    }
    return response.json() as Promise<T>
  }
}
