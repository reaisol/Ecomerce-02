import type {
  Category,
  PaginatedResult,
  PriceRange,
  Product,
} from "@lib/catalog/types"
import ProductGrid from "@modules/products/components/product-grid"
import ActiveFilters from "@modules/store/components/active-filters"
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@modules/store/components/breadcrumbs"
import DesktopFilters from "@modules/store/components/desktop-filters"
import ListingEmptyState from "@modules/store/components/listing-empty-state"
import ListingHeader from "@modules/store/components/listing-header"
import ListingSearch from "@modules/store/components/listing-search"
import MobileFilters from "@modules/store/components/mobile-filters"
import { Pagination } from "@modules/store/components/pagination"
import SortDropdown from "@modules/store/components/sort-dropdown"
import {
  clearedFilters,
  countActiveFilters,
  toSearchString,
  type ListingFilters,
} from "@modules/store/lib/listing-filters"

type ProductListingTemplateProps = {
  /** Route path without the country prefix, e.g. "/store". */
  basePath: string
  title: string
  description?: string
  breadcrumbs: BreadcrumbItem[]
  filters: ListingFilters
  result: PaginatedResult<Product>
  priceRange: PriceRange
  /** All store categories; used for empty-state suggestions and chip labels. */
  categories: Category[]
  /** Adds the category filter group (for listings that span categories). */
  showCategoryFilter?: boolean
  showSearch?: boolean
}

const ProductListingTemplate = ({
  basePath,
  title,
  description,
  breadcrumbs,
  filters,
  result,
  priceRange,
  categories,
  showCategoryFilter,
  showSearch,
}: ProductListingTemplateProps) => {
  const categoryOptions = showCategoryFilter
    ? categories.map(({ slug, name, productCount }) => ({
        slug,
        name,
        productCount,
      }))
    : undefined
  const categoryNames = Object.fromEntries(
    categories.map((category) => [category.slug, category.name])
  )
  const filterProps = { filters, priceRange, categories: categoryOptions }

  return (
    <div className="bg-surface-muted pb-16" data-testid="product-listing">
      <div className="content-container pt-4 small:pt-6">
        <Breadcrumbs items={breadcrumbs} />
        <ListingHeader title={title} description={description} result={result} />
        {showSearch && <ListingSearch key={filters.q ?? ""} filters={filters} />}

        <div className="mt-6 grid grid-cols-1 gap-8 small:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden small:block" aria-label="Product filters">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl bg-white p-5 shadow-card no-scrollbar">
              <DesktopFilters {...filterProps} />
            </div>
          </aside>

          <section aria-label="Products" className="min-w-0">
            <div className="mb-4 flex items-center gap-3 small:justify-end">
              <div className="small:hidden">
                <MobileFilters {...filterProps} />
              </div>
              <SortDropdown
                filters={filters}
                className="min-w-0 flex-1 small:w-64 small:flex-none"
              />
            </div>

            <ActiveFilters
              basePath={basePath}
              filters={filters}
              categoryNames={categoryNames}
            />

            {result.items.length > 0 ? (
              <ProductGrid products={result.items} priorityCount={4} />
            ) : (
              <ListingEmptyState
                hasFilters={countActiveFilters(filters) > 0 || filters.page > 1}
                clearHref={`${basePath}${toSearchString(clearedFilters(filters))}`}
                categories={categories.slice(0, 5)}
              />
            )}

            <Pagination
              basePath={basePath}
              filters={filters}
              totalPages={result.totalPages}
            />
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProductListingTemplate
