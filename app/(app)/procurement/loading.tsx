export default function ProcurementLoading() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="px-6 mb-6">
        <div className="h-7 w-44 rounded-md bg-panel/60 animate-pulse" />
        <div className="mt-2 h-4 w-72 rounded bg-panel/40 animate-pulse" />
      </div>
      <div className="px-6 space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-12 rounded-lg border border-border bg-panel/40 animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}
