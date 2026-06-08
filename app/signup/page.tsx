import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth/auth-shell'
import { SignupForm } from '@/components/auth/signup-form'
import { createClient } from '@/lib/supabase/server'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; key?: string; invite?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    if (params.invite) redirect(`/invite/${params.invite}`)
    redirect('/dashboard')
  }

  const redirectTo = params.invite ? `/invite/${params.invite}` : '/dashboard'

  return (
    <AuthShell
      title="Create account"
      subtitle="Use the invite key from your email to finish sign-up."
    >
      <SignupForm
        initialEmail={params.email ?? ''}
        initialKey={params.key ?? ''}
        redirectTo={redirectTo}
      />
    </AuthShell>
  )
}
