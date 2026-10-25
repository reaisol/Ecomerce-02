import { XMark } from "@medusajs/icons"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  buildListingHref,
  clearedFilters,
  getFilterChips,
  toSearchString,
  type ListingFilters,
} from "@modules/store/lib/listing-filters"

type ActiveFiltersProps = {
  basePath: string
  filters: ListingFilters
  categoryNames?: Record<string, string>
}

const ActiveFilters = ({ basePath, filters, categoryNames }: ActiveFiltersProps) => {
  const chips = getFilterChips(filters, categoryNames)

  if (!chips.length) return null

  return (
    <div
      className="mb-4 flex flex-wrap items-center gap-2"
      aria-label="Active filters"
      data-testid="active-filters"
    >
      {chips.map((chip) => (
        <LocalizedClientLink
          key={chip.key}
          href={buildListingHref(basePath, filters, chip.changes)}
          scroll={false}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 py-1 pl-3 pr-2 text-xs font-semibold text-brand-800 hover:border-brand-300 hover:bg-brand-100"
          aria-label={`Remove filter ${chip.label}`}
        >
          {chip.label}
          <XMark className="h-3.5 w-3.5" aria-hidden />
        </LocalizedClientLink>
      ))}
      <LocalizedClientLink
        href={`${basePath}${toSearchString(clearedFilters(filters))}`}
        scroll={false}
        className="px-1 text-xs font-semibold text-grey-60 underline-offset-2 hover:text-navy-900 hover:underline"
      >
        Clear all
      </LocalizedClientLink>
    </div>
  )
}

export default ActiveFilters
