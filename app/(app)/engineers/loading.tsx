export default function EngineersLoading() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="px-6 mb-6">
        <div className="h-7 w-40 rounded-md bg-panel/60 animate-pulse" />
        <div className="mt-2 h-4 w-64 rounded bg-panel/40 animate-pulse" />
      </div>
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-panel/40 p-4 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-panel/60" />
              <div className="h-4 w-24 rounded bg-panel/60" />
            </div>
            <div className="h-6 w-20 rounded-full bg-panel/60" />
          </div>
        ))}
      </div>
    </div>
  )
}
