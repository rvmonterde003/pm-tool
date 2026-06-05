'use client'

import { useRef, useTransition } from 'react'
import Image from 'next/image'
import { updateCover } from '@/lib/actions/projects'
import { cn } from '@/lib/utils/cn'

export function CoverUpload({
  projectId,
  currentCoverUrl,
}: {
  projectId: string
  currentCoverUrl: string | null
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    startTransition(async () => {
      await updateCover({ projectId, oldCoverUrl: currentCoverUrl, newCoverFile: file })
    })
  }

  function handleRemove() {
    startTransition(async () => {
      await updateCover({ projectId, oldCoverUrl: currentCoverUrl, newCoverFile: null })
    })
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs text-text-muted uppercase tracking-widest">Cover image</label>
      <div className={cn('relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-border', isPending && 'opacity-50')}>
        {currentCoverUrl ? (
          <Image src={currentCoverUrl} alt="Project cover" fill className="object-cover" sizes="400px" />
        ) : (
          <div className="w-full h-full bg-panel flex items-center justify-center">
            <span className="text-xs text-text-muted">No cover</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isPending}
          className="flex-1 text-xs py-2 border border-border rounded-lg text-text-muted hover:border-orange hover:text-orange transition-colors disabled:opacity-50"
        >
          {currentCoverUrl ? 'Replace' : 'Upload'}
        </button>
        {currentCoverUrl && (
          <button
            onClick={handleRemove}
            disabled={isPending}
            className="flex-1 text-xs py-2 border border-border rounded-lg text-text-muted hover:border-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
