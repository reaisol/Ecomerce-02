"use client"

import { ChevronDown } from "@medusajs/icons"
import { usePathname, useRouter } from "next/navigation"

import { PRODUCT_SORT_OPTIONS, type ProductSort } from "@lib/catalog/types"
import { clx } from "@modules/common/components/ui"
import {
  buildListingHref,
  SORT_LABELS,
  type ListingFilters,
} from "@modules/store/lib/listing-filters"

const SortDropdown = ({
  filters,
  className,
}: {
  filters: ListingFilters
  className?: string
}) => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className={clx("relative flex items-center gap-2", className)}>
      <label
        htmlFor="listing-sort"
        className="hidden whitespace-nowrap text-sm text-grey-50 xsmall:block"
      >
        Sort by
      </label>
      <div className="relative min-w-0 flex-1">
        <select
          id="listing-sort"
          value={filters.sort}
          onChange={(event) =>
            router.push(
              buildListingHref(pathname, filters, {
                sort: event.target.value as ProductSort,
              }),
              { scroll: false }
            )
          }
          className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-grey-20 bg-white pl-3 pr-9 text-sm font-medium text-navy-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          aria-label="Sort products"
          data-testid="sort-dropdown"
        >
          {PRODUCT_SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {SORT_LABELS[option]}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-grey-50"
          aria-hidden
        />
      </div>
    </div>
  )
}

export default SortDropdown
