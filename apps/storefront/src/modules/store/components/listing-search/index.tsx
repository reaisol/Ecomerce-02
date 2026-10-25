"use client"

import { MagnifyingGlass, XMark } from "@medusajs/icons"
import { usePathname, useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

import {
  buildListingHref,
  type ListingFilters,
} from "@modules/store/lib/listing-filters"

/** Narrows the current listing by keyword while keeping every other filter. */
const ListingSearch = ({ filters }: { filters: ListingFilters }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [term, setTerm] = useState(filters.q ?? "")

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push(
      buildListingHref(pathname, filters, { q: term.trim() || undefined })
    )
  }

  const clear = () => {
    setTerm("")
    if (filters.q) {
      router.push(buildListingHref(pathname, filters, { q: undefined }))
    }
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className="relative mt-4 w-full max-w-xl"
      data-testid="listing-search"
    >
      <label htmlFor="listing-search-input" className="sr-only">
        Search within products
      </label>
      <MagnifyingGlass
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-40"
        aria-hidden
      />
      <input
        id="listing-search-input"
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search within products"
        maxLength={100}
        className="h-11 w-full rounded-xl border border-grey-20 bg-white pl-10 pr-24 text-sm text-navy-900 placeholder:text-grey-40 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 [&::-webkit-search-cancel-button]:hidden"
      />
      {term && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-[4.75rem] top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-grey-40 hover:bg-surface-subtle hover:text-navy-900"
          aria-label="Clear search"
        >
          <XMark />
        </button>
      )}
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-brand-600 px-3.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Search
      </button>
    </form>
  )
}

export default ListingSearch
