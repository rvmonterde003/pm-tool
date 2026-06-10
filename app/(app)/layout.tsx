import { redirect } from 'next/navigation'
import { AppNav } from '@/components/app/app-nav'
import { ProfileDock } from '@/components/app/profile-dock'
import { createClient } from '@/lib/supabase/server'
import { NetworkBgLoader } from '@/components/ui/network-bg-loader'
import { ToastProvider } from '@/components/ui/toast'
import type { WorkStatus } from '@/types'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const today = new Date().toISOString().slice(0, 10)
  const { data: attendance } = await supabase
    .from('engineer_attendance')
    .select('status')
    .eq('user_id', user.id)
    .eq('attendance_date', today)
    .maybeSingle()

  return (
    <div className="min-h-screen relative">
      <NetworkBgLoader />
      <AppNav />
      <main className="relative z-10 pb-24">
        <ToastProvider>{children}</ToastProvider>
      </main>
      <ProfileDock
        email={user.email ?? ''}
        userId={user.id}
        todayStatus={(attendance?.status as WorkStatus | undefined) ?? null}
      />
    </div>
  )
}
