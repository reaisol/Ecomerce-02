export default function Loading() {
  return (
    <main className="animate-pulse" aria-label="Loading homepage" role="status">
      <div className="border-b border-grey-10 bg-white">
        <div className="content-container flex gap-4 overflow-hidden py-4">
          {[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="h-16 w-16 shrink-0 rounded-2xl bg-grey-10" />)}
        </div>
      </div>
      <div className="content-container py-5 small:py-8"><div className="h-[360px] rounded-3xl bg-grey-10 small:h-[480px]" /></div>
      <div className="content-container grid grid-cols-1 gap-4 py-6 small:grid-cols-3"><div className="h-48 rounded-2xl bg-grey-10" /><div className="h-48 rounded-2xl bg-grey-10" /><div className="h-48 rounded-2xl bg-grey-10" /></div>
      <span className="sr-only">Loading homepage</span>
    </main>
  )
}
