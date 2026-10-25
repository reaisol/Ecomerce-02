import repeat from "@lib/util/repeat"

const SkeletonCartTotals = () => (
  <div className="rounded-2xl border border-grey-10 bg-white p-5 shadow-card small:p-6">
    <div className="h-3 w-24 animate-pulse rounded bg-grey-10" />
    <div className="mt-5 flex flex-col gap-4">
      {repeat(3).map((index) => (
        <div key={index} className="flex justify-between">
          <div className="h-3 w-28 animate-pulse rounded bg-grey-10" />
          <div className="h-3 w-16 animate-pulse rounded bg-grey-10" />
        </div>
      ))}
    </div>
    <div className="my-5 border-t border-dashed border-grey-20" />
    <div className="flex justify-between">
      <div className="h-5 w-28 animate-pulse rounded bg-grey-10" />
      <div className="h-5 w-20 animate-pulse rounded bg-grey-10" />
    </div>
    <div className="mt-6 h-12 w-full animate-pulse rounded-xl bg-grey-10" />
  </div>
)

export default SkeletonCartTotals
