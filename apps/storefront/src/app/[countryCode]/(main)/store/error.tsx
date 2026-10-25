"use client"

import ListingError from "@modules/store/components/listing-error"

export default function StoreError({ reset }: { reset: () => void }) {
  return <ListingError onRetry={reset} />
}
