'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/brand/logo'
import { NewProjectButton } from '@/components/app/new-project-button'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Projects' },
  { href: '/procurement', label: 'Procurement' },
  { href: '/engineers', label: 'Engineers' },
] as const

export function AppNav() {
  const pathname = usePathname()
  const isProjectPage = /^\/projects\/[^/]+$/.test(pathname)
  const isDashboard = pathname === '/dashboard'

  return (
    <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
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

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        {NAV_ITEMS.map(({ href, label }) => {
          const active = pathname === href || (href === '/dashboard' && isProjectPage)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-4 py-2 text-sm rounded-lg transition-colors',
                active
                  ? 'text-orange font-semibold'
                  : 'text-text-muted hover:text-text-primary'
              )}
            >
              {label}
            </Link>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        {isDashboard && <NewProjectButton />}
      </div>
    </nav>
  )
}
