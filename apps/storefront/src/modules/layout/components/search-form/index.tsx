"use client"

import { MagnifyingGlass } from "@medusajs/icons"
import Form from "next/form"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { useCountryCode } from "@lib/hooks/use-country-code"
import { clx } from "@modules/common/components/ui"

type SearchFormProps = {
  className?: string
  /** Distinguishes multiple search boxes on one page for assistive tech and tests. */
  id: string
}

/**
 * Product search. A plain GET form to the store page, so it works before
 * hydration; `next/form` upgrades it to client-side navigation once loaded.
 */
const SearchForm = (props: SearchFormProps) => (
  <Suspense fallback={<SearchFormView {...props} />}>
    <SearchFormWithCurrentQuery {...props} />
  </Suspense>
)

const SearchFormWithCurrentQuery = (props: SearchFormProps) => {
  const query = useSearchParams().get("q") ?? ""
  return <SearchFormView {...props} defaultQuery={query} />
}

const SearchFormView = ({
  className,
  id,
  defaultQuery = "",
}: SearchFormProps & { defaultQuery?: string }) => {
  const countryCode = useCountryCode()

  return (
    <Form
      action={`/${countryCode}/store`}
      role="search"
      className={clx("relative w-full", className)}
    >
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        // Re-mount when the URL query changes so the box mirrors the current search.
        key={defaultQuery}
        id={id}
        type="search"
        name="q"
        defaultValue={defaultQuery}
        placeholder="Search kitchen, storage, cleaning and more"
        autoComplete="off"
        enterKeyHint="search"
        className="h-11 w-full rounded-xl border border-grey-20 bg-surface-muted pl-4 pr-12 text-sm text-navy-900 placeholder:text-grey-50 transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
        data-testid="search-input"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 top-1 flex h-9 w-10 items-center justify-center rounded-lg bg-brand-600 text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
      >
        <MagnifyingGlass />
      </button>
    </Form>
  )
}

export default SearchForm
