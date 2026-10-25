"use client"

import { Adjustments, XMark } from "@medusajs/icons"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import type { PriceRange } from "@lib/catalog/types"
import FilterPanel, {
  type CategoryOption,
} from "@modules/store/components/filter-panel"
import {
  clearedFilters,
  countActiveFilters,
  toSearchString,
  type ListingFilters,
} from "@modules/store/lib/listing-filters"

type MobileFiltersProps = {
  filters: ListingFilters
  priceRange: PriceRange
  categories?: CategoryOption[]
}

/**
 * Bottom sheet for phones and tablets. Choices are staged in a draft and only
 * hit the URL on Apply, so each tap does not reload the results behind it.
 */
const MobileFilters = ({ filters, priceRange, categories }: MobileFiltersProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState(filters)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const activeCount = countActiveFilters(filters)

  const open = () => {
    setDraft(filters)
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)

  const apply = (next: ListingFilters) => {
    setIsOpen(false)
    router.push(`${pathname}${toSearchString({ ...next, page: 1 })}`)
  }

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-grey-20 bg-white px-3.5 text-sm font-semibold text-navy-900 hover:border-brand-300"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        data-testid="mobile-filters-button"
      >
        <Adjustments aria-hidden />
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end" role="presentation">
          <div
            className="absolute inset-0 bg-navy-900/50"
            onClick={close}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filters-title"
            className="relative flex max-h-[88vh] w-full flex-col rounded-t-2xl bg-white shadow-card-hover"
            data-testid="mobile-filters-sheet"
          >
            <div className="flex items-center justify-between border-b border-grey-10 px-4 py-3">
              <h2
                id="mobile-filters-title"
                className="font-display text-lg font-bold text-navy-900"
              >
                Filters
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                className="flex h-9 w-9 items-center justify-center rounded-full text-grey-60 hover:bg-surface-subtle"
                aria-label="Close filters"
              >
                <XMark />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              <FilterPanel
                idPrefix="sheet"
                value={draft}
                onChange={setDraft}
                priceRange={priceRange}
                categories={categories}
              />
            </div>

            <div className="flex gap-3 border-t border-grey-10 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => apply(clearedFilters(draft))}
                className="h-11 flex-1 rounded-xl border border-grey-20 text-sm font-semibold text-navy-900 hover:bg-surface-muted"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => apply(draft)}
                className="h-11 flex-[2] rounded-xl bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700"
                data-testid="apply-filters"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileFilters
