import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthForm } from '@/components/auth/auth-form'

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    if (params.invite) redirect(`/invite/${params.invite}`)
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-page flex items-center justify-center">
      <div className="w-full max-w-sm space-y-8 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-text-primary">Realign</h1>
          <p className="mt-2 text-sm text-text-muted">Track what shipped, what slipped, what&apos;s blocking.</p>
        </div>
        <AuthForm redirectTo={params.invite ? `/invite/${params.invite}` : '/dashboard'} />
      </div>
    </main>
  )
}
