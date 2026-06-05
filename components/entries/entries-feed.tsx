'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns'
import { EntryCard } from './entry-card'
import { AddEntryModal } from './add-entry-modal'
import { getCurrentMonday } from '@/lib/utils/week'
import type { Entry } from '@/types'

export function EntriesFeed({ projectId, entries }: { projectId: string; entries: Entry[] }) {
  const [viewDate, setViewDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)

  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)

  const monthEntries = entries.filter(e =>
    isWithinInterval(parseISO(e.week_start), { start: monthStart, end: monthEnd })
  )

  const currentMonday = getCurrentMonday()
  const weeklyCount = entries.filter(e => e.week_start === currentMonday).length

  function prevMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  function nextMonth() {
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
    if (next <= new Date()) setViewDate(next)
  }

  const isCurrentMonth =
    viewDate.getMonth() === new Date().getMonth() &&
    viewDate.getFullYear() === new Date().getFullYear()

  return (
    <div className="flex-1 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="text-text-muted hover:text-text-primary transition-colors px-2">‹</button>
          <span className="text-sm font-semibold text-text-primary w-32 text-center">
            {format(viewDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="text-text-muted hover:text-text-primary transition-colors px-2 disabled:opacity-30"
          >
            ›
          </button>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          disabled={weeklyCount >= 2 && isCurrentMonth}
          title={weeklyCount >= 2 ? 'Max 2 entries per week' : 'Add entry'}
          className="px-4 py-2 text-xs font-semibold bg-orange text-black rounded-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          + Add entry
        </button>
      </div>

      {/* Entries */}
      {monthEntries.length === 0 ? (
        <p className="text-sm text-text-muted py-8 text-center">No entries for {format(viewDate, 'MMMM yyyy')}.</p>
      ) : (
        <div className="space-y-4">
          {[...monthEntries].reverse().map(entry => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      <AddEntryModal
        projectId={projectId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        weeklyCount={weeklyCount}
      />
    </div>
  )
}
