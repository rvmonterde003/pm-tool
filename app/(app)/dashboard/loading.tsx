export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="px-6 mb-6">
        <div className="h-7 w-40 rounded-md bg-panel/60 animate-pulse" />
        <div className="mt-2 h-4 w-56 rounded bg-panel/40 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-2xl border border-border bg-panel/40 animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}
