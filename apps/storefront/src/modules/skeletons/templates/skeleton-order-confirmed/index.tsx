import repeat from "@lib/util/repeat"

const SkeletonOrderConfirmed = () => (
  <div className="bg-surface-muted py-8 small:py-12" aria-busy="true">
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 xsmall:px-6">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-grey-10 bg-white p-8 shadow-card">
        <div className="h-14 w-14 animate-pulse rounded-full bg-grey-10" />
        <div className="h-7 w-3/4 max-w-sm animate-pulse rounded bg-grey-10" />
        <div className="h-4 w-48 animate-pulse rounded bg-grey-10" />
        <div className="h-4 w-56 animate-pulse rounded bg-grey-10" />
      </div>
      <div className="grid grid-cols-1 gap-6 xsmall:grid-cols-2">
        {repeat(2).map((index) => (
          <div key={index} className="h-36 animate-pulse rounded-2xl bg-white shadow-card" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-white shadow-card" />
    </div>
  </div>
)

export default SkeletonOrderConfirmed
