import { createClient } from '@/lib/supabase/server'
import { ProjectGrid } from '@/components/projects/project-grid'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="px-6 mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
        <p className="text-sm text-text-muted mt-1">All projects you&apos;re a member of</p>
      </div>
      <ProjectGrid projects={projects ?? []} />
    </div>
  )
}
