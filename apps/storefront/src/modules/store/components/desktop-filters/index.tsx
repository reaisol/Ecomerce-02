"use client"

import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"

import type { PriceRange } from "@lib/catalog/types"
import { clx } from "@modules/common/components/ui"
import FilterPanel, {
  type CategoryOption,
} from "@modules/store/components/filter-panel"
import {
  clearedFilters,
  countActiveFilters,
  toSearchString,
  type ListingFilters,
} from "@modules/store/lib/listing-filters"

type DesktopFiltersProps = {
  filters: ListingFilters
  priceRange: PriceRange
  categories?: CategoryOption[]
}

/** Sidebar variant: every change applies immediately. */
const DesktopFilters = ({ filters, priceRange, categories }: DesktopFiltersProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const apply = (next: ListingFilters) =>
    startTransition(() => {
      router.push(`${pathname}${toSearchString(next)}`, { scroll: false })
    })

  return (
    <div
      className={clx("transition-opacity", { "opacity-60": isPending })}
      aria-busy={isPending}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-navy-900">Filters</h2>
        {countActiveFilters(filters) > 0 && (
          <button
            type="button"
            onClick={() => apply(clearedFilters(filters))}
            className="text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            Clear all
          </button>
        )}
      </div>
      <FilterPanel
        idPrefix="sidebar"
        value={filters}
        onChange={apply}
        priceRange={priceRange}
        categories={categories}
      />
    </div>
  )
}

export default DesktopFilters
