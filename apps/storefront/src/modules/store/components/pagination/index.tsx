import { ChevronLeft, ChevronRight } from "@medusajs/icons"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import {
  buildListingHref,
  type ListingFilters,
} from "@modules/store/lib/listing-filters"

type PageSlot = number | "gap"

/** Always shows first, last and the neighbours of the current page. */
function getPageSlots(page: number, totalPages: number): PageSlot[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  if (page <= 3) [2, 3, 4].forEach((p) => pages.add(p))
  if (page >= totalPages - 2) {
    ;[totalPages - 3, totalPages - 2, totalPages - 1].forEach((p) => pages.add(p))
  }

  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)

  return sorted.flatMap<PageSlot>((p, index) =>
    index > 0 && p - sorted[index - 1] > 1 ? ["gap", p] : [p]
  )
}

type PaginationProps = {
  basePath: string
  filters: ListingFilters
  totalPages: number
}

export function Pagination({ basePath, filters, totalPages }: PaginationProps) {
  const { page } = filters

  if (totalPages <= 1) return null

  const hrefFor = (target: number) =>
    buildListingHref(basePath, filters, { page: target })

  const stepClass =
    "flex h-10 items-center gap-1 rounded-xl px-3 text-sm font-semibold"

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1.5"
      data-testid="product-pagination"
    >
      {page > 1 ? (
        <LocalizedClientLink
          href={hrefFor(page - 1)}
          className={clx(stepClass, "text-navy-900 hover:bg-white")}
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden />
          <span className="hidden xsmall:inline">Previous</span>
        </LocalizedClientLink>
      ) : (
        <span className={clx(stepClass, "text-grey-30")} aria-hidden>
          <ChevronLeft />
          <span className="hidden xsmall:inline">Previous</span>
        </span>
      )}

      {getPageSlots(page, totalPages).map((slot, index) =>
        slot === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-grey-40" aria-hidden>
            …
          </span>
        ) : (
          <LocalizedClientLink
            key={slot}
            href={hrefFor(slot)}
            aria-current={slot === page ? "page" : undefined}
            aria-label={`Page ${slot}`}
            className={clx(
              "flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl text-sm font-semibold tabular-nums",
              slot === page
                ? "bg-brand-600 text-white"
                : "text-navy-900 hover:bg-white"
            )}
          >
            {slot}
          </LocalizedClientLink>
        )
      )}

      {page < totalPages ? (
        <LocalizedClientLink
          href={hrefFor(page + 1)}
          className={clx(stepClass, "text-navy-900 hover:bg-white")}
          aria-label="Next page"
        >
          <span className="hidden xsmall:inline">Next</span>
          <ChevronRight aria-hidden />
        </LocalizedClientLink>
      ) : (
        <span className={clx(stepClass, "text-grey-30")} aria-hidden>
          <span className="hidden xsmall:inline">Next</span>
          <ChevronRight />
        </span>
      )}
    </nav>
  )
}
