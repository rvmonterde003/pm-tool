import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NetworkBg } from '@/components/ui/network-bg'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { ToastProvider } from '@/components/ui/toast'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <div className="min-h-screen relative">
      <NetworkBg />
      <nav className="border-b border-border bg-page/80 backdrop-blur-sm sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-black tracking-tight text-text-primary">Realign</span>
        <SignOutButton />
      </nav>
      <main className="relative z-10">
        <ToastProvider>{children}</ToastProvider>
      </main>
    </div>
  )
}
