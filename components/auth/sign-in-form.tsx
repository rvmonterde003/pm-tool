'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { authButtonClass, authInputClass, authLinkClass } from '@/components/auth/auth-styles'

export function SignInForm({ redirectTo = '/dashboard' }: { redirectTo?: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    window.location.href = redirectTo
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
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={authInputClass}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs text-text-muted mb-1 uppercase tracking-widest">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={authInputClass}
          placeholder="••••••••"
        />
      </div>

      <button type="submit" disabled={loading} className={authButtonClass}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      {message && <p className="text-xs text-center text-text-muted">{message}</p>}

      <p className="text-center text-xs text-text-muted">
        Need an account?{' '}
        <Link href="/signup/request" className={authLinkClass}>
          Request sign-up invite
        </Link>
      </p>
    </form>
  )
}
