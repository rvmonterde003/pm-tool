export default function ProjectLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6 items-start">
      <div className="w-full max-w-sm shrink-0 space-y-4">
        <div className="aspect-[4/3] rounded-2xl border border-border bg-panel/40 animate-pulse" />
        <div className="h-6 w-2/3 rounded bg-panel/50 animate-pulse" />
        <div className="h-4 w-full rounded bg-panel/30 animate-pulse" />
      </div>
      <div className="flex-1 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-border bg-panel/40 animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}
