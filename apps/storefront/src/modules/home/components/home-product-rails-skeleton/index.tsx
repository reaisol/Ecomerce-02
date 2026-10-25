export default function HomeProductRailsSkeleton() {
  return (
    <div className="content-container space-y-12 py-8 small:space-y-16" aria-label="Loading collections" role="status">
      {[0, 1].map((row) => (
        <div key={row} className="animate-pulse">
          <div className="mb-6 h-7 w-44 rounded bg-grey-10" />
          <div className="grid grid-cols-2 gap-4 small:grid-cols-4 small:gap-6">
            {[0, 1, 2, 3].map((item) => (
              <div key={item}>
                <div className="aspect-[4/5] rounded-2xl bg-grey-10" />
                <div className="mt-3 h-4 w-3/4 rounded bg-grey-10" />
                <div className="mt-2 h-4 w-1/3 rounded bg-grey-10" />
              </div>
            ))}
          </div>
        </div>
      ))}
      <span className="sr-only">Loading collections</span>
    </div>
  )
}
