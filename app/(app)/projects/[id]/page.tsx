import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LeftPanel } from '@/components/detail/left-panel'
import { RealtimeEntries } from '@/components/detail/realtime-entries'
import { signEntryAttachments } from '@/lib/storage/sign-attachments'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: project }, { data: entries }] = await Promise.all([
    supabase
      .from('projects')
      .select('*, project_members(user_id, profiles(id, display_name, avatar_url))')
      .eq('id', id)
      .single(),
    supabase
      .from('entries')
      .select('*, entry_attachments(*), profiles(id, display_name)')
      .eq('project_id', id)
      .order('created_at', { ascending: true }),
  ])

  if (!project) notFound()

  const signedEntries = await signEntryAttachments(supabase, entries ?? [])
  const isCreator = project.created_by === user?.id

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6 items-start">
      <LeftPanel project={project} isCreator={isCreator} />
      <RealtimeEntries projectId={project.id} initialEntries={signedEntries} />
    </div>
  )
}
