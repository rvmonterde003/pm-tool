import { redirect } from 'next/navigation'
import { AppNav } from '@/components/app/app-nav'
import { createClient } from '@/lib/supabase/server'
import { NetworkBgLoader } from '@/components/ui/network-bg-loader'
import { ToastProvider } from '@/components/ui/toast'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <div className="min-h-screen relative">
      <NetworkBgLoader />
      <AppNav email={user.email ?? ''} />
      <main className="relative z-10">
        <ToastProvider>{children}</ToastProvider>
      </main>
    </div>
  )
}
