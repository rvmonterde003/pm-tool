'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateTodayStatus } from '@/lib/actions/engineers'
import { ChangePasswordModal } from '@/components/app/change-password-modal'
import { cn } from '@/lib/utils/cn'
import type { WorkStatus } from '@/types'

const STATUS_OPTIONS: { value: WorkStatus; label: string }[] = [
  { value: 'in-office', label: 'In office' },
  { value: 'wfh', label: 'WFH' },
  { value: 'on-leave', label: 'On leave' },
]

const STATUS_COLORS: Record<WorkStatus, string> = {
  'in-office': 'bg-emerald-500',
  wfh: 'bg-sky-500',
  'on-leave': 'bg-amber-500',
}

export function ProfileMenu({
  email,
  userId,
  todayStatus,
}: {
  email: string
  userId: string
  todayStatus: WorkStatus | null
}) {
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [status, setStatus] = useState<WorkStatus | null>(todayStatus)
  const [isPending, startTransition] = useTransition()

  const initial = (email[0] ?? '?').toUpperCase()

  useEffect(() => {
    setStatus(todayStatus)
  }, [todayStatus])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  function handleStatusChange(next: WorkStatus) {
    setStatus(next)
    startTransition(async () => {
      const result = await updateTodayStatus(next)
      if (result.error) setStatus(todayStatus)
    })
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className={cn(
            'flex items-center gap-2 rounded-full border border-border bg-panel/90 backdrop-blur-sm pl-1 pr-3 py-1',
            'hover:border-orange transition-colors shadow-lg'
          )}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-orange text-black text-xs font-bold">
            {initial}
            {status && (
              <span
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-panel',
                  STATUS_COLORS[status]
                )}
              />
            )}
          </span>
          <span className="hidden sm:block text-xs text-text-muted max-w-[140px] truncate">{email}</span>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute left-0 bottom-full mb-2 w-56 rounded-xl border border-border bg-surface py-1 shadow-lg z-50"
          >
            <p className="px-3 py-2 text-[10px] text-text-muted truncate border-b border-border sm:hidden">
              {email}
            </p>

            <div className="px-3 py-2 border-b border-border">
              <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">Today&apos;s status</p>
              <div className="flex flex-col gap-1">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusChange(opt.value)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors text-left',
                      status === opt.value
                        ? 'bg-panel text-text-primary'
                        : 'text-text-muted hover:bg-panel hover:text-text-primary'
                    )}
                  >
                    <span className={cn('h-2 w-2 rounded-full shrink-0', STATUS_COLORS[opt.value])} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                setPasswordOpen(true)
              }}
              className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-panel transition-colors"
            >
              Change password
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-sm text-text-muted hover:bg-panel hover:text-text-primary transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      <ChangePasswordModal open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </>
  )
}
