'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types'

export async function joinViaToken(token: string): Promise<ActionResult<{ projectId: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  // Check project invite token first
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('invite_token', token)
    .single()

  let projectId: string | null = null

  if (project) {
    projectId = project.id
  } else {
    // Check email-based invite
    const { data: invite } = await supabase
      .from('project_invites')
      .select('project_id')
      .eq('token', token)
      .is('accepted_at', null)
      .single()

    if (!invite) return { data: null, error: 'Invalid or expired invite link.' }

    projectId = invite.project_id

    // Mark invite as accepted
    await supabase
      .from('project_invites')
      .update({ accepted_at: new Date().toISOString() })
      .eq('token', token)
  }

  // Add to project_members (ignore if already a member)
  const { error } = await supabase
    .from('project_members')
    .upsert({ project_id: projectId!, user_id: user.id }, { onConflict: 'project_id,user_id' })

  if (error) return { data: null, error: error.message }

  revalidatePath(`/projects/${projectId!}`)
  return { data: { projectId: projectId! }, error: null }
}

export async function sendEmailInvite({
  projectId,
  email,
}: {
  projectId: string
  email: string
}): Promise<ActionResult<null>> {
  if (!email.includes('@')) return { data: null, error: 'Invalid email address.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  const { data: invite, error: insertError } = await supabase
    .from('project_invites')
    .insert({ project_id: projectId, invited_email: email })
    .select()
    .single()

  if (insertError) return { data: null, error: insertError.message }

  // Trigger email send
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token: invite.token, projectId }),
  })

  if (!response.ok) return { data: null, error: 'Failed to send email.' }

  return { data: null, error: null }
}
