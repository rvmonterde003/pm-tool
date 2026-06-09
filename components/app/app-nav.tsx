'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/brand/logo'
import { NewProjectButton } from '@/components/app/new-project-button'
import { ProfileMenu } from '@/components/app/profile-menu'
import { cn } from '@/lib/utils/cn'

export function AppNav({ email }: { email: string }) {
  const pathname = usePathname()
  const isProjectPage = /^\/projects\/[^/]+$/.test(pathname)
  const isDashboard = pathname === '/dashboard'

  return (
    <nav className="border-b border-border bg-page/80 backdrop-blur-sm sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 min-w-0">
        {isProjectPage && (
          <Link
            href="/dashboard"
            className={cn(
              'shrink-0 text-xs text-text-muted hover:text-orange transition-colors',
              'border border-border rounded-lg px-2.5 py-1.5 hover:border-orange/50'
            )}
          >
            ← Back
          </Link>
        )}
        <Logo size="sm" />
      </div>

      <div className="flex items-center gap-3">
        {isDashboard && <NewProjectButton />}
        <ProfileMenu email={email} />
      </div>
    </nav>
  )
}
