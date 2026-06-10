import { createClient } from '@/lib/supabase/server'
import { EngineerCards } from '@/components/engineers/engineer-cards'
import type { EngineerAttendance, EngineerWithStatus, WorkStatus } from '@/types'

// The attendance calendar only renders recent months, so we bound history to a
// fixed window instead of scanning the whole table (which grows unbounded).
const ATTENDANCE_WINDOW_DAYS = 120

export default async function EngineersPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)
  const windowStart = new Date(Date.now() - ATTENDANCE_WINDOW_DAYS * 86_400_000)
    .toISOString()
    .slice(0, 10)

  const [{ data: profiles }, { data: todayAttendance }, { data: allAttendance }] = await Promise.all([
    supabase.from('profiles').select('*').order('display_name'),
    supabase.from('engineer_attendance').select('*').eq('attendance_date', today),
    supabase
      .from('engineer_attendance')
      .select('*')
      .gte('attendance_date', windowStart)
      .order('attendance_date', { ascending: false }),
  ])

  const statusByUser = new Map(
    (todayAttendance ?? []).map(a => [a.user_id, a.status as WorkStatus])
  )

  const engineers: EngineerWithStatus[] = (profiles ?? []).map(p => ({
    ...p,
    today_status: statusByUser.get(p.id) ?? null,
  }))

  const attendanceByUser: Record<string, EngineerAttendance[]> = {}
  for (const record of allAttendance ?? []) {
    if (!attendanceByUser[record.user_id]) attendanceByUser[record.user_id] = []
    attendanceByUser[record.user_id].push(record as EngineerAttendance)
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="px-6 mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Engineers</h1>
        <p className="text-sm text-text-muted mt-1">Team availability and attendance</p>
      </div>
      <EngineerCards engineers={engineers} attendanceByUser={attendanceByUser} />
    </div>
  )
}
