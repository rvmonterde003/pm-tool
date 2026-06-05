'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentMonday } from '@/lib/utils/week'
import type { ActionResult, Entry } from '@/types'

export async function createEntry({
  projectId,
  whatShipped,
  whatSlipped,
  whatsBlocking,
  attachments,
}: {
  projectId: string
  whatShipped: string
  whatSlipped: string
  whatsBlocking: string
  attachments: File[]
}): Promise<ActionResult<Entry>> {
  if (!whatShipped.trim() && !whatSlipped.trim() && !whatsBlocking.trim()) {
    return { data: null, error: 'At least one field (shipped, slipped, or blocking) is required.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  const weekStart = getCurrentMonday()

  // Enforce max 2 entries per week
  const { count } = await supabase
    .from('entries')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('week_start', weekStart)

  if ((count ?? 0) >= 2) {
    return { data: null, error: 'Maximum 2 entries per week reached.' }
  }

  const { data: entry, error: entryError } = await supabase
    .from('entries')
    .insert({
      project_id: projectId,
      author_id: user.id,
      week_start: weekStart,
      what_shipped: whatShipped.trim(),
      what_slipped: whatSlipped.trim(),
      whats_blocking: whatsBlocking.trim(),
    })
    .select()
    .single()

  if (entryError) return { data: null, error: entryError.message }

  for (const file of attachments) {
    const path = `attachments/${entry.id}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(path, file)

    if (!uploadError) {
      await supabase.from('entry_attachments').insert({
        entry_id: entry.id,
        file_url: path,
        file_name: file.name,
        uploaded_by: user.id,
      })
    }
  }

  revalidatePath(`/projects/${projectId}`)
  return { data: entry, error: null }
}
