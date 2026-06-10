'use client'

import { ProfileMenu } from '@/components/app/profile-menu'
import type { WorkStatus } from '@/types'

export function ProfileDock({
  email,
  userId,
  todayStatus,
}: {
  email: string
  userId: string
  todayStatus: WorkStatus | null
}) {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <ProfileMenu email={email} userId={userId} todayStatus={todayStatus} />
    </div>
  )
}
