'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, Project } from '@/types'

export async function createProject({
  name,
  coverFile,
}: {
  name: string
  coverFile: File | null
}): Promise<ActionResult<Project>> {
  if (!name.trim()) return { data: null, error: 'Project name is required.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  let cover_url: string | null = null

  if (coverFile) {
    const ext = coverFile.name.split('.').pop()
    const path = `covers/${user.id}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('covers')
      .upload(path, coverFile, { upsert: false })
    if (uploadError) return { data: null, error: uploadError.message }

    const { data: urlData } = supabase.storage.from('covers').getPublicUrl(path)
    cover_url = urlData.publicUrl
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({ name: name.trim(), created_by: user.id, cover_url })
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  revalidatePath('/dashboard')
  return { data, error: null }
}

export async function deleteProject(projectId: string): Promise<ActionResult<null>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('created_by', user.id)

  if (error) return { data: null, error: error.message }

  revalidatePath('/dashboard')
  return { data: null, error: null }
}

export async function updateProgress({
  projectId,
  progress,
}: {
  projectId: string
  progress: number
}): Promise<ActionResult<null>> {
  if (progress < 0 || progress > 100) {
    return { data: null, error: 'Progress must be between 0 and 100.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .update({ progress })
    .eq('id', projectId)

  if (error) return { data: null, error: error.message }

  revalidatePath(`/projects/${projectId}`)
  return { data: null, error: null }
}

export async function updateCover({
  projectId,
  oldCoverUrl,
  newCoverFile,
}: {
  projectId: string
  oldCoverUrl: string | null
  newCoverFile: File | null
}): Promise<ActionResult<{ cover_url: string | null }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  // Delete old cover if it exists
  if (oldCoverUrl) {
    const path = oldCoverUrl.split('/storage/v1/object/public/covers/')[1]
    if (path) await supabase.storage.from('covers').remove([path])
  }

  let cover_url: string | null = null

  if (newCoverFile) {
    const ext = newCoverFile.name.split('.').pop()
    const path = `covers/${user.id}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('covers')
      .upload(path, newCoverFile)
    if (uploadError) return { data: null, error: uploadError.message }
    const { data: urlData } = supabase.storage.from('covers').getPublicUrl(path)
    cover_url = urlData.publicUrl
  }

  const { error } = await supabase
    .from('projects')
    .update({ cover_url })
    .eq('id', projectId)

  if (error) return { data: null, error: error.message }

  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/dashboard')
  return { data: { cover_url }, error: null }
}
