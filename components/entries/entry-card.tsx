import { getWeekRange } from '@/lib/utils/week'
import type { Entry } from '@/types'

function BentoCell({ label, content }: { label: string; content: string }) {
  if (!content) return null
  return (
    <div className="p-4 border-b border-border last:border-b-0">
      <p className="text-xs text-text-muted uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm text-text-primary whitespace-pre-wrap">{content}</p>
    </div>
  )
}

export function EntryCard({ entry }: { entry: Entry }) {
  return (
    <article className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <span className="text-xs text-text-muted">{getWeekRange(entry.week_start)}</span>
        {entry.profiles && (
          <span className="text-xs text-text-muted ml-2">· {entry.profiles.display_name}</span>
        )}
      </div>
      <BentoCell label="What shipped" content={entry.what_shipped} />
      <BentoCell label="What slipped & why" content={entry.what_slipped} />
      <BentoCell label="What's blocking" content={entry.whats_blocking} />
      {entry.entry_attachments && entry.entry_attachments.length > 0 && (
        <div className="px-4 py-3 border-t border-border flex flex-wrap gap-2">
          {entry.entry_attachments.map(att => (
            <span
              key={att.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-panel border border-border rounded-full text-xs text-text-muted"
            >
              📎 {att.file_name}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
