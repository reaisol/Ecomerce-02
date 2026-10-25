import { MagnifyingGlass } from "@medusajs/icons"

import type { Category } from "@lib/catalog/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ListingEmptyStateProps = {
  clearHref: string
  hasFilters: boolean
  categories: Pick<Category, "slug" | "name">[]
}

const ListingEmptyState = ({
  clearHref,
  hasFilters,
  categories,
}: ListingEmptyStateProps) => (
  <div
    className="flex flex-col items-center rounded-2xl border border-dashed border-grey-20 bg-white px-6 py-12 text-center"
    data-testid="listing-empty-state"
  >
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
      <MagnifyingGlass />
    </span>
    <h2 className="mt-4 font-display text-lg font-bold text-navy-900">
      {hasFilters
        ? "No products match your filters"
        : "No products here yet"}
    </h2>
    <p className="mt-1 max-w-sm text-sm text-grey-50">
      {hasFilters
        ? "Try removing a filter, widening the price range or searching for something else."
        : "We are restocking this aisle. Browse another category in the meantime."}
    </p>
    {hasFilters && (
      <LocalizedClientLink
        href={clearHref}
        className="mt-5 inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Clear filters
      </LocalizedClientLink>
    )}
    {categories.length > 0 && (
      <div className="mt-8 w-full">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-grey-50">
          Popular categories
        </p>
        <ul className="mt-3 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <LocalizedClientLink
                href={`/categories/${category.slug}`}
                className="inline-flex rounded-full border border-grey-20 px-3.5 py-1.5 text-sm font-medium text-navy-900 hover:border-brand-300 hover:bg-brand-50"
              >
                {category.name}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)

export default ListingEmptyState
