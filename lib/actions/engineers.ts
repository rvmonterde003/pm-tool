'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, EngineerAttendance, WorkStatus } from '@/types'

export async function updateTodayStatus(
  status: WorkStatus
): Promise<ActionResult<EngineerAttendance>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('engineer_attendance')
    .upsert(
      { user_id: user.id, attendance_date: today, status },
      { onConflict: 'user_id,attendance_date' }
    )
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  revalidatePath('/engineers')
  return { data, error: null }
}
