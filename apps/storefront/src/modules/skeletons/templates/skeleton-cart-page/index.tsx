import repeat from "@lib/util/repeat"
import SkeletonCartItem from "@modules/skeletons/components/skeleton-cart-item"
import SkeletonCartTotals from "@modules/skeletons/components/skeleton-cart-totals"

const SkeletonCartPage = () => (
  <div className="bg-surface-muted py-8 small:py-12" aria-busy="true">
    <div className="content-container">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-grey-20" />
      <div className="mt-6 grid grid-cols-1 items-start gap-6 small:grid-cols-[minmax(0,1fr)_380px] small:gap-8">
        <div className="divide-y divide-grey-10 rounded-2xl border border-grey-10 bg-white px-4 shadow-card xsmall:px-6">
          {repeat(3).map((index) => (
            <SkeletonCartItem key={index} />
          ))}
        </div>
        <SkeletonCartTotals />
      </div>
    </div>
  </div>
)

export default SkeletonCartPage
