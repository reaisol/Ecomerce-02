import type {
  Category,
  PaginatedResult,
  PriceRange,
  Product,
  ProductQuery,
} from "../types"

/**
 * Contract every catalog data source implements.
 *
 * Swapping the local JSON provider for the backend API means adding another
 * implementation of this interface and selecting it in `./index.ts`; the
 * services and UI stay untouched.
 */
export interface CatalogRepository {
  listProducts(query: ProductQuery): Promise<PaginatedResult<Product>>
  getProductBySlug(slug: string): Promise<Product | null>
  getProductsByIds(ids: string[]): Promise<Product[]>
  getPriceRange(categoryId?: string): Promise<PriceRange>
  listCategories(): Promise<Category[]>
  getCategoryBySlug(slug: string): Promise<Category | null>
}
