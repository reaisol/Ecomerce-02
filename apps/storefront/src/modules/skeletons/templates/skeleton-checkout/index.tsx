import repeat from "@lib/util/repeat"
import SkeletonCartTotals from "@modules/skeletons/components/skeleton-cart-totals"

const SkeletonCheckout = () => (
  <div className="content-container py-6 small:py-10" aria-busy="true">
    <div className="h-8 w-40 animate-pulse rounded-lg bg-grey-20" />
    <div className="mt-6 grid grid-cols-1 items-start gap-6 small:grid-cols-[minmax(0,1fr)_400px] small:gap-8">
      <div className="flex flex-col gap-6">
        {repeat(3).map((index) => (
          <div
            key={index}
            className="rounded-2xl border border-grey-10 bg-white p-4 shadow-card xsmall:p-6"
          >
            <div className="h-6 w-48 animate-pulse rounded bg-grey-10" />
            <div className="mt-5 grid grid-cols-1 gap-4 xsmall:grid-cols-2">
              {repeat(4).map((field) => (
                <div key={field} className="h-12 animate-pulse rounded-xl bg-grey-10" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden small:block">
        <SkeletonCartTotals />
      </div>
    </div>
  </div>
)

export default SkeletonCheckout
