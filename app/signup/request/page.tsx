import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth/auth-shell'
import { RequestSignupForm } from '@/components/auth/request-signup-form'
import { createClient } from '@/lib/supabase/server'

export default async function RequestSignupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <AuthShell
      title="Request sign-up"
      subtitle="We'll email you a sign-up link and invite key."
    >
      <RequestSignupForm />
    </AuthShell>
  )
}
