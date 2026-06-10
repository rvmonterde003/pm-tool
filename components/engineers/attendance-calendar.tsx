'use client'

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { cn } from '@/lib/utils/cn'
import type { EngineerAttendance, WorkStatus } from '@/types'

const STATUS_COLORS: Record<WorkStatus, string> = {
  'in-office': 'bg-emerald-500',
  wfh: 'bg-sky-500',
  'on-leave': 'bg-amber-500',
}

const STATUS_LABELS: Record<WorkStatus, string> = {
  'in-office': 'In office',
  wfh: 'WFH',
  'on-leave': 'On leave',
}

export function AttendanceCalendar({
  attendance,
  monthOffset = 0,
}: {
  attendance: EngineerAttendance[]
  monthOffset?: number
}) {
  const viewDate = subMonths(new Date(), monthOffset)
  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const byDate = new Map(attendance.map(a => [a.attendance_date, a.status]))

  const startPad = monthStart.getDay()

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">
        {format(viewDate, 'MMMM yyyy')}
      </h3>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-text-muted mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map(day => {
          const key = format(day, 'yyyy-MM-dd')
          const status = byDate.get(key)
          return (
            <div
              key={key}
              title={status ? `${format(day, 'MMM d')}: ${STATUS_LABELS[status]}` : format(day, 'MMM d')}
              className={cn(
                'aspect-square rounded-md flex flex-col items-center justify-center text-[10px] border border-border/40',
                isSameMonth(day, viewDate) ? 'bg-panel/40' : 'opacity-30'
              )}
            >
              <span className="text-text-muted">{format(day, 'd')}</span>
              {status && (
                <span className={cn('mt-0.5 h-1.5 w-1.5 rounded-full', STATUS_COLORS[status])} />
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-4 text-[10px] text-text-muted">
        {(Object.keys(STATUS_COLORS) as WorkStatus[]).map(s => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={cn('h-2 w-2 rounded-full', STATUS_COLORS[s])} />
            {STATUS_LABELS[s]}
          </span>
        ))}
      </div>
    </div>
  )
}
