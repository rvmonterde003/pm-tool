import { EntriesFeed } from '@/components/entries/entries-feed'
import type { Entry } from '@/types'

export function RightPanel({ projectId, entries }: { projectId: string; entries: Entry[] }) {
  return (
    <div className="flex-1 min-w-0 bg-panel border border-border rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-4">Entries</h2>
      <EntriesFeed projectId={projectId} entries={entries} />
    </div>
  )
}
