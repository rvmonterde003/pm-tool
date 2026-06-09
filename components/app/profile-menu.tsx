'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChangePasswordModal } from '@/components/app/change-password-modal'
import { cn } from '@/lib/utils/cn'

export function ProfileMenu({ email }: { email: string }) {
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  const initial = (email[0] ?? '?').toUpperCase()

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

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className={cn(
            'flex items-center gap-2 rounded-full border border-border bg-panel pl-1 pr-3 py-1',
            'hover:border-orange transition-colors'
          )}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange text-black text-xs font-bold">
            {initial}
          </span>
          <span className="hidden sm:block text-xs text-text-muted max-w-[140px] truncate">{email}</span>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-surface py-1 shadow-lg z-50"
          >
            <p className="px-3 py-2 text-[10px] text-text-muted truncate border-b border-border sm:hidden">
              {email}
            </p>
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
