import { RAIL_ITEM_CLASS } from "./rail-item-class"

const ProductRailSkeleton = () => (
  <div
    className="content-container py-8 small:py-10"
    role="status"
    aria-label="Loading products"
  >
    <div className="mb-6 h-7 w-48 animate-pulse rounded-lg bg-grey-10" />
    <div className="flex gap-3 overflow-hidden xsmall:gap-4 small:gap-5">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className={`${RAIL_ITEM_CLASS} animate-pulse`}>
          <div className="aspect-square rounded-2xl bg-grey-10" />
          <div className="mt-3 h-4 w-4/5 rounded bg-grey-10" />
          <div className="mt-2 h-4 w-1/3 rounded bg-grey-10" />
        </div>
      ))}
    </div>
  </div>
)

export default ProductRailSkeleton
