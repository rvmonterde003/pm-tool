'use client'

import { useState } from 'react'
import { ModalPortal } from '@/components/ui/modal-portal'
import { AttendanceCalendar } from '@/components/engineers/attendance-calendar'
import { cn } from '@/lib/utils/cn'
import type { EngineerAttendance, EngineerWithStatus, WorkStatus } from '@/types'

const STATUS_LABELS: Record<WorkStatus, string> = {
  'in-office': 'In office',
  wfh: 'WFH',
  'on-leave': 'On leave',
}

const STATUS_STYLES: Record<WorkStatus, string> = {
  'in-office': 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  wfh: 'border-sky-500/40 bg-sky-500/10 text-sky-400',
  'on-leave': 'border-amber-500/40 bg-amber-500/10 text-amber-400',
}

export function EngineerCards({
  engineers,
  attendanceByUser,
}: {
  engineers: EngineerWithStatus[]
  attendanceByUser: Record<string, EngineerAttendance[]>
}) {
  const [selected, setSelected] = useState<EngineerWithStatus | null>(null)

  return (
    <>
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {engineers.map(engineer => {
          const initial = (engineer.display_name[0] ?? '?').toUpperCase()
          const status = engineer.today_status

          return (
            <button
              key={engineer.id}
              type="button"
              onClick={() => setSelected(engineer)}
              className="text-left rounded-xl border border-border bg-panel/50 p-4 hover:border-orange/50 hover:bg-panel transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange text-black text-sm font-bold shrink-0">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate group-hover:text-orange transition-colors">
                    {engineer.display_name}
                  </p>
                </div>
              </div>
              {status ? (
                <span className={cn('inline-block text-xs px-2.5 py-1 rounded-full border capitalize', STATUS_STYLES[status])}>
                  {STATUS_LABELS[status]}
                </span>
              ) : (
                <span className="inline-block text-xs px-2.5 py-1 rounded-full border border-border text-text-muted">
                  No status set
                </span>
              )}
            </button>
          )
        })}
      </div>

      <ModalPortal open={!!selected}>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4 my-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange text-black text-sm font-bold">
                    {(selected.display_name[0] ?? '?').toUpperCase()}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">{selected.display_name}</h2>
                    {selected.today_status && (
                      <p className="text-xs text-text-muted capitalize">{STATUS_LABELS[selected.today_status]}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-text-muted hover:text-text-primary text-sm px-2 py-1"
                >
                  Close
                </button>
              </div>

              <AttendanceCalendar attendance={attendanceByUser[selected.id] ?? []} />
            </div>
          </div>
        )}
      </ModalPortal>
    </>
  )
}
