/** Mirrors the ProductCard layout so the grid does not shift when data arrives. */
const SkeletonProductPreview = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-grey-10 bg-white">
    <div className="aspect-square bg-grey-10" />
    <div className="flex flex-col gap-2.5 p-3 small:p-4">
      <div className="h-3 w-1/3 rounded bg-grey-10" />
      <div className="h-4 w-full rounded bg-grey-10" />
      <div className="h-4 w-2/3 rounded bg-grey-10" />
      <div className="h-3 w-1/2 rounded bg-grey-10" />
      <div className="h-5 w-2/5 rounded bg-grey-10" />
      <div className="mt-2 h-10 w-full rounded-xl bg-grey-10" />
    </div>
  </div>
)

export default SkeletonProductPreview
