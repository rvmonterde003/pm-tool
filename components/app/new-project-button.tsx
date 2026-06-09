'use client'

import { useState } from 'react'
import { NewProjectModal } from '@/components/projects/new-project-modal'
import { cn } from '@/lib/utils/cn'

export function NewProjectButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'px-3 py-1.5 text-xs font-semibold rounded-lg',
          'bg-orange text-black hover:brightness-110 transition-all'
        )}
      >
        + New project
      </button>
      <NewProjectModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
