import repeat from "@lib/util/repeat"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

const SkeletonListingPage = () => (
  <div
    className="animate-pulse bg-surface-muted pb-16"
    role="status"
    aria-label="Loading products"
  >
    <div className="content-container pt-4 small:pt-6">
      <div className="h-4 w-40 rounded bg-grey-10" />
      <div className="mt-4 h-8 w-64 rounded bg-grey-10" />
      <div className="mt-3 h-4 w-full max-w-md rounded bg-grey-10" />
      <div className="mt-6 grid grid-cols-1 gap-8 small:grid-cols-[280px_minmax(0,1fr)]">
        <div className="hidden h-[520px] rounded-2xl bg-white p-5 small:block">
          {repeat(6).map((index) => (
            <div key={index} className="mb-5 h-4 w-3/4 rounded bg-grey-10" />
          ))}
        </div>
        <div>
          <div className="mb-4 flex justify-end gap-3">
            <div className="h-10 w-28 rounded-xl bg-grey-10 small:hidden" />
            <div className="h-10 flex-1 rounded-xl bg-grey-10 small:w-64 small:flex-none" />
          </div>
          <SkeletonProductGrid numberOfProducts={8} />
        </div>
      </div>
    </div>
    <span className="sr-only">Loading products</span>
  </div>
)

export default SkeletonListingPage
