"use client"

import ListingError from "@modules/store/components/listing-error"

export default function CategoryError({ reset }: { reset: () => void }) {
  return <ListingError onRetry={reset} />
}
