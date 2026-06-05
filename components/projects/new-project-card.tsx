'use client'

import { useState } from 'react'
import { NewProjectModal } from './new-project-modal'

export function NewProjectCard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-border hover:border-orange/50 transition-colors flex flex-col items-center justify-center gap-2 group"
      >
        <span className="text-3xl text-text-muted group-hover:text-orange transition-colors">+</span>
        <span className="text-xs text-text-muted group-hover:text-text-primary transition-colors">New Project</span>
      </button>
      <NewProjectModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
