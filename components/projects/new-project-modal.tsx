'use client'

import { useRef, useState, useTransition } from 'react'
import { createProject } from '@/lib/actions/projects'
import { cn } from '@/lib/utils/cn'

export function NewProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (preview) URL.revokeObjectURL(preview)
    setCoverFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const result = await createProject({ name, coverFile })
      if (result.error) { setError(result.error); return }
      if (preview) URL.revokeObjectURL(preview)
      setName(''); setCoverFile(null); setPreview(null)
      onClose()
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">New project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="project-name" className="block text-xs text-text-muted mb-1 uppercase tracking-widest">Name</label>
            <input
              id="project-name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className={cn(
                'w-full bg-panel border border-border rounded-lg px-4 py-3 text-sm text-text-primary',
                'outline-none focus:border-orange focus:shadow-orange transition-all'
              )}
              placeholder="Project name"
            />
          </div>

          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-widest">Cover image</label>
            {preview ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden">
                <img src={preview} alt="preview" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => { if (preview) URL.revokeObjectURL(preview); setCoverFile(null); setPreview(null) }}
                  className="absolute top-2 right-2 bg-black/60 text-text-muted hover:text-text-primary text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-40 rounded-xl border-2 border-dashed border-border hover:border-orange/50 flex items-center justify-center text-xs text-text-muted transition-colors"
              >
                Upload cover
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          {error && <p className="text-xs text-orange border border-orange/30 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-text-muted border border-border rounded-lg hover:border-text-muted transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="flex-1 py-2 text-sm font-semibold bg-orange text-black rounded-lg hover:brightness-110 disabled:opacity-50 transition-all">
              {isPending ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
