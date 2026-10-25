const SkeletonCartItem = () => (
  <div className="flex gap-4 py-5">
    <div className="h-24 w-24 shrink-0 animate-pulse rounded-xl bg-grey-10 xsmall:h-28 xsmall:w-28" />
    <div className="flex flex-1 flex-col gap-2">
      <div className="h-4 w-3/4 animate-pulse rounded bg-grey-10" />
      <div className="h-3 w-1/3 animate-pulse rounded bg-grey-10" />
      <div className="h-4 w-24 animate-pulse rounded bg-grey-10" />
      <div className="mt-auto h-8 w-28 animate-pulse rounded-xl bg-grey-10" />
    </div>
  </div>
)

export default SkeletonCartItem
