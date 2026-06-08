'use client'

import Link from 'next/link'
import { useState } from 'react'
import { authButtonClass, authInputClass, authLinkClass } from '@/components/auth/auth-styles'

export function RequestSignupForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setSent(false)

    const res = await fetch('/api/signup/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setMessage(data.error ?? 'Could not send invite email.')
      return
    }

    setSent(true)
    setMessage('Check your email for a sign-up link and invite key. It expires in 24 hours.')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-center text-text-muted">
        Enter your email and we&apos;ll send a sign-up link plus an invite key you&apos;ll need to create your account.
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
          disabled={sent}
        />
      </div>

      <button type="submit" disabled={loading || sent} className={authButtonClass}>
        {loading ? 'Sending…' : sent ? 'Email sent' : 'Send sign-up invite'}
      </button>

      {message && (
        <p className={`text-xs text-center ${sent ? 'text-orange' : 'text-text-muted'}`}>{message}</p>
      )}

      <p className="text-center text-xs text-text-muted">
        Already have an account?{' '}
        <Link href="/" className={authLinkClass}>
          Sign in
        </Link>
      </p>
    </form>
  )
}
