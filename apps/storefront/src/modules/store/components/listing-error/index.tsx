"use client"

import { ArrowPath } from "@medusajs/icons"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

/** Shared body for the listing routes' error boundaries. */
const ListingError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="content-container py-16">
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl bg-white px-6 py-12 text-center shadow-card">
      <h1 className="font-display text-xl font-bold text-navy-900">
        We could not load these products
      </h1>
      <p className="mt-2 text-sm text-grey-50">
        Something went wrong on our side. Please try again in a moment.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <ArrowPath aria-hidden />
          Try again
        </button>
        <LocalizedClientLink
          href="/"
          className="inline-flex h-11 items-center rounded-xl border border-grey-20 px-5 text-sm font-semibold text-navy-900 hover:bg-surface-muted"
        >
          Go to home
        </LocalizedClientLink>
      </div>
    </div>
  </div>
)

export default ListingError
