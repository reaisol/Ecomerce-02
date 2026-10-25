import repeat from "@lib/util/repeat"

const SkeletonProductPage = () => (
  <div
    className="animate-pulse bg-surface-muted pb-16"
    role="status"
    aria-label="Loading product"
  >
    <div className="content-container pt-4 small:pt-6">
      <div className="h-4 w-56 rounded bg-grey-10" />
      <div className="mt-5 grid grid-cols-1 gap-6 small:grid-cols-2 small:gap-10">
        <div>
          <div className="aspect-square rounded-2xl bg-white" />
          <div className="mt-3 flex gap-2">
            {repeat(4).map((index) => (
              <div key={index} className="h-16 w-16 rounded-xl bg-grey-10" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 small:p-7">
          <div className="h-3 w-24 rounded bg-grey-10" />
          <div className="h-8 w-full rounded bg-grey-10" />
          <div className="h-4 w-40 rounded bg-grey-10" />
          <div className="h-9 w-48 rounded bg-grey-10" />
          <div className="h-20 w-full rounded bg-grey-10" />
          <div className="flex gap-3">
            <div className="h-12 flex-1 rounded-xl bg-grey-10" />
            <div className="h-12 flex-1 rounded-xl bg-grey-10" />
          </div>
        </div>
      </div>
    </div>
    <span className="sr-only">Loading product</span>
  </div>
)

export default SkeletonProductPage
