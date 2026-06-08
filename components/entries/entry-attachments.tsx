'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isImageFile } from '@/lib/utils/files'
import { cn } from '@/lib/utils/cn'
import type { EntryAttachment } from '@/types'

type ResolvedAttachment = EntryAttachment & { signedUrl: string | null }

export function EntryAttachments({ attachments }: { attachments: EntryAttachment[] }) {
  const attachmentKey = useMemo(
    () => attachments.map(att => att.id).join(','),
    [attachments]
  )

  const [resolved, setResolved] = useState<ResolvedAttachment[]>(() =>
    attachments.map(att => ({ ...att, signedUrl: null }))
  )

  useEffect(() => {
    setResolved(attachments.map(att => ({ ...att, signedUrl: null })))

    const supabase = createClient()
    let cancelled = false

    async function resolveUrls() {
      const results = await Promise.all(
        attachments.map(async att => {
          const { data, error } = await supabase.storage
            .from('attachments')
            .createSignedUrl(att.file_url, 3600, { download: att.file_name })

          return { ...att, signedUrl: error ? null : data.signedUrl }
        })
      )

      if (!cancelled) setResolved(results)
    }

    resolveUrls()

    return () => {
      cancelled = true
    }
  }, [attachmentKey, attachments])

  const images = resolved.filter(att => isImageFile(att.file_name))
  const files = resolved.filter(att => !isImageFile(att.file_name))

  const linkClass = cn(
    'inline-flex items-center gap-1.5 px-3 py-1.5',
    'bg-panel border border-border rounded-full text-xs text-text-primary',
    'hover:border-orange hover:text-orange transition-colors duration-150'
  )

  return (
    <div className="px-4 py-3 border-t border-border space-y-3">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map(att => (
            <a
              key={att.id}
              href={att.signedUrl ?? undefined}
              download={att.file_name}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group block rounded-lg border border-border bg-panel overflow-hidden',
                'hover:border-orange transition-colors duration-150',
                !att.signedUrl && 'pointer-events-none opacity-60'
              )}
              title={`Download ${att.file_name}`}
            >
              <div className="h-36 w-48 flex items-center justify-center p-2">
                {att.signedUrl ? (
                  <img
                    src={att.signedUrl}
                    alt={att.file_name}
                    className="h-full w-auto max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-text-muted">Loading…</span>
                )}
              </div>
              <p className="px-2 py-1.5 border-t border-border text-[10px] text-text-muted truncate group-hover:text-orange">
                {att.file_name}
              </p>
            </a>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map(att => (
            <a
              key={att.id}
              href={att.signedUrl ?? undefined}
              download={att.file_name}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(linkClass, !att.signedUrl && 'pointer-events-none opacity-60')}
              title={`Download ${att.file_name}`}
            >
              <span aria-hidden>↓</span>
              {att.file_name}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
