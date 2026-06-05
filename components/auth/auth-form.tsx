'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

export function AuthForm({ redirectTo = '/dashboard' }: { redirectTo?: string }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}${redirectTo}` },
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for a sign-in link.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-xs text-text-muted mb-1 uppercase tracking-widest">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={cn(
            'w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-text-primary',
            'placeholder:text-text-muted outline-none',
            'focus:border-orange focus:shadow-orange transition-all duration-150'
          )}
          placeholder="you@example.com"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={cn(
          'w-full bg-orange text-black font-semibold text-sm py-3 rounded-lg',
          'hover:brightness-110 transition-all duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {loading ? 'Sending…' : 'Send sign-in link'}
      </button>
      {message && (
        <p className="text-xs text-center text-text-muted">{message}</p>
      )}
    </form>
  )
}
