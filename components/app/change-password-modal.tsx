'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { authInputClass, authButtonClass } from '@/components/auth/auth-styles'
import { cn } from '@/lib/utils/cn'

export function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  if (!open) return null

  function handleClose() {
    setPassword('')
    setConfirm('')
    setMessage('')
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.')
      return
    }

    if (password !== confirm) {
      setMessage('Passwords do not match.')
      return
    }

    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setMessage(error.message)
        return
      }

      handleClose()
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Change password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-xs text-text-muted mb-1 uppercase tracking-widest">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={authInputClass}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-xs text-text-muted mb-1 uppercase tracking-widest">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className={authInputClass}
            />
          </div>
          {message && <p className="text-xs text-orange">{message}</p>}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 text-sm text-text-muted border border-border rounded-lg hover:border-text-muted transition-colors"
            >
              Cancel
            </button>
            <button type="submit" disabled={isPending} className={cn(authButtonClass, 'flex-1')}>
              {isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
