'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { authButtonClass, authInputClass, authLinkClass } from '@/components/auth/auth-styles'

export function SignupForm({
  initialEmail = '',
  initialKey = '',
  redirectTo = '/dashboard',
}: {
  initialEmail?: string
  initialKey?: string
  redirectTo?: string
}) {
  const [email, setEmail] = useState(initialEmail)
  const [inviteKey, setInviteKey] = useState(initialKey)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (password !== passwordConfirm) {
      setMessage('Passwords do not match.')
      setLoading(false)
      return
    }

    const res = await fetch('/api/signup/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, inviteKey, password, passwordConfirm }),
    })

    const data = await res.json()

    if (!res.ok) {
      setMessage(data.error ?? 'Could not create account.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage('Account created. Sign in with your new password.')
      setLoading(false)
      return
    }

    window.location.href = redirectTo
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-center text-text-muted">
        Paste the invite key from your email. Keys expire 24 hours after they&apos;re sent.
      </p>

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
        <label htmlFor="inviteKey" className="block text-xs text-text-muted mb-1 uppercase tracking-widest">
          Invite key
        </label>
        <input
          id="inviteKey"
          type="text"
          required
          autoComplete="off"
          value={inviteKey}
          onChange={e => setInviteKey(e.target.value.toUpperCase())}
          className={authInputClass}
          placeholder="A1B2C3D4E5F6"
          spellCheck={false}
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
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={authInputClass}
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label htmlFor="passwordConfirm" className="block text-xs text-text-muted mb-1 uppercase tracking-widest">
          Confirm password
        </label>
        <input
          id="passwordConfirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={e => setPasswordConfirm(e.target.value)}
          className={authInputClass}
          placeholder="Repeat password"
        />
      </div>

      <button type="submit" disabled={loading} className={authButtonClass}>
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      {message && <p className="text-xs text-center text-text-muted">{message}</p>}

      <p className="text-center text-xs text-text-muted">
        Need an invite?{' '}
        <Link href="/signup/request" className={authLinkClass}>
          Request sign-up email
        </Link>
        {' · '}
        <Link href="/" className={authLinkClass}>
          Sign in
        </Link>
      </p>
    </form>
  )
}
