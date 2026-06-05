'use client'

import { useRef, useState, useTransition } from 'react'
import { createEntry } from '@/lib/actions/entries'
import { cn } from '@/lib/utils/cn'

export function AddEntryModal({
  projectId,
  open,
  onClose,
  weeklyCount,
}: {
  projectId: string
  open: boolean
  onClose: () => void
  weeklyCount: number
}) {
  const [shipped, setShipped] = useState('')
  const [slipped, setSlipped] = useState('')
  const [blocking, setBlocking] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const atLimit = weeklyCount >= 2

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    setFiles(prev => [...prev, ...selected])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const result = await createEntry({
        projectId,
        whatShipped: shipped,
        whatSlipped: slipped,
        whatsBlocking: blocking,
        attachments: files,
      })
      if (result.error) { setError(result.error); return }
      setShipped(''); setSlipped(''); setBlocking(''); setFiles([])
      onClose()
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg space-y-4 mx-4">
        <h2 className="text-lg font-semibold text-text-primary">Add entry</h2>

        {atLimit ? (
          <p className="text-sm text-text-muted border border-border rounded-lg p-4">
            Maximum 2 entries reached for this week.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'What shipped', value: shipped, set: setShipped, placeholder: 'Features, fixes, or releases that went out…' },
              { label: 'What slipped & why', value: slipped, set: setSlipped, placeholder: "What didn't make it and why…" },
              { label: "What's blocking", value: blocking, set: setBlocking, placeholder: 'Current blockers or dependencies…' },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <label className="block text-xs text-text-muted uppercase tracking-widest mb-1">{label}</label>
                <textarea
                  value={value}
                  onChange={e => set(e.target.value)}
                  placeholder={placeholder}
                  rows={3}
                  className={cn(
                    'w-full bg-panel border border-border rounded-lg px-4 py-3 text-sm text-text-primary resize-none',
                    'placeholder:text-text-muted outline-none focus:border-orange focus:shadow-orange transition-all'
                  )}
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-text-muted uppercase tracking-widest mb-1">Attachments</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {files.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-panel border border-border rounded-full text-xs text-text-muted">
                    📎 {f.name}
                    <button type="button" onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} className="ml-1 hover:text-orange">×</button>
                  </span>
                ))}
              </div>
              <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-text-muted hover:text-orange transition-colors">
                + Add file
              </button>
              <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />
            </div>

            {error && <p className="text-xs text-orange border border-orange/30 rounded-lg px-3 py-2">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-text-muted border border-border rounded-lg hover:border-text-muted transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isPending} className="flex-1 py-2 text-sm font-semibold bg-orange text-black rounded-lg hover:brightness-110 disabled:opacity-50 transition-all">
                {isPending ? 'Saving…' : 'Add entry'}
              </button>
            </div>
          </form>
        )}

        {atLimit && (
          <button onClick={onClose} className="w-full py-2 text-sm text-text-muted border border-border rounded-lg">Close</button>
        )}
      </div>
    </div>
  )
}
