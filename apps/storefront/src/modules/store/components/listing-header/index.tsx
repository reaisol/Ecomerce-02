import type { PaginatedResult, Product } from "@lib/catalog/types"

function describeRange({ total, page, limit }: PaginatedResult<Product>) {
  if (total === 0) return "No products found"
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)
  const noun = total === 1 ? "product" : "products"
  return start > total
    ? `${total} ${noun}`
    : `Showing ${start}–${end} of ${total} ${noun}`
}

const ListingHeader = ({
  title,
  description,
  result,
}: {
  title: string
  description?: string
  result: PaginatedResult<Product>
}) => (
  <header className="mt-3 small:mt-4">
    <h1 className="font-display text-2xl font-bold text-navy-900 small:text-3xl">
      {title}
    </h1>
    {description && (
      <p className="mt-1.5 max-w-3xl text-sm text-grey-60 small:text-base">
        {description}
      </p>
    )}
    <p
      className="mt-2 text-sm text-grey-50"
      aria-live="polite"
      data-testid="listing-result-count"
    >
      {describeRange(result)}
    </p>
  </header>
)

export default ListingHeader
