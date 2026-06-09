import { redirect } from 'next/navigation'
import { AppNav } from '@/components/app/app-nav'
import { createClient } from '@/lib/supabase/server'
import { NetworkBg } from '@/components/ui/network-bg'
import { ToastProvider } from '@/components/ui/toast'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <div className="min-h-screen relative">
      <NetworkBg />
      <AppNav email={user.email ?? ''} />
      <main className="relative z-10">
        <ToastProvider>{children}</ToastProvider>
      </main>
    </div>
  )
}
