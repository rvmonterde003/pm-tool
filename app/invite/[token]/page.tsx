import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { joinViaToken } from '@/lib/actions/members'

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/?invite=${token}`)
  }

  const result = await joinViaToken(token)

  if (result.error) {
    return (
      <main className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black text-text-primary">Realign</h1>
          <p className="text-sm text-text-muted">{result.error}</p>
          <a
            href="/dashboard"
            className="inline-block mt-4 px-6 py-2 bg-orange text-black text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
          >
            Go to dashboard
          </a>
        </div>
      </main>
    )
  }

  redirect(`/projects/${result.data!.projectId}`)
}
