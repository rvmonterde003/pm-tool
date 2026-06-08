'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

type AuthMode = 'signin' | 'signup' | 'magic'

export function AuthForm({ redirectTo = '/dashboard' }: { redirectTo?: string }) {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const supabase = createClient()
    const redirectUrl = `${location.origin}${redirectTo}`

    if (mode === 'magic') {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectUrl },
      })
      setMessage(error ? error.message : 'Check your email for a sign-in link.')
    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
      })
      setMessage(
        error
          ? error.message
          : 'Account created. Check your email to confirm, or sign in if confirmation is disabled.'
      )
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        window.location.href = redirectTo
        return
      }
    }

    setLoading(false)
  }

  const inputClass = cn(
    'w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-text-primary',
    'placeholder:text-text-muted outline-none',
    'focus:border-orange focus:shadow-orange transition-all duration-150'
  )

  const buttonClass = cn(
    'w-full bg-orange text-black font-semibold text-sm py-3 rounded-lg',
    'hover:brightness-110 transition-all duration-150',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  )

  const linkClass = 'text-xs text-orange hover:brightness-110 transition-all'

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
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      {mode !== 'magic' && (
        <div>
          <label htmlFor="password" className="block text-xs text-text-muted mb-1 uppercase tracking-widest">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
      )}

      <button type="submit" disabled={loading} className={buttonClass}>
        {loading
          ? 'Please wait…'
          : mode === 'magic'
            ? 'Send magic link'
            : mode === 'signup'
              ? 'Create account'
              : 'Sign in'}
      </button>

      {message && <p className="text-xs text-center text-text-muted">{message}</p>}

      <div className="space-y-2 text-center">
        {mode === 'signin' && (
          <>
            <button type="button" onClick={() => { setMode('magic'); setMessage('') }} className={linkClass}>
              Sign in with magic link instead
            </button>
            <p className="text-xs text-text-muted">
              New here?{' '}
              <button type="button" onClick={() => { setMode('signup'); setMessage('') }} className={linkClass}>
                Create an account
              </button>
            </p>
          </>
        )}

        {mode === 'signup' && (
          <p className="text-xs text-text-muted">
            Already have an account?{' '}
            <button type="button" onClick={() => { setMode('signin'); setMessage('') }} className={linkClass}>
              Sign in
            </button>
          </p>
        )}

        {mode === 'magic' && (
          <button type="button" onClick={() => { setMode('signin'); setMessage('') }} className={linkClass}>
            Sign in with password instead
          </button>
        )}
      </div>
    </form>
  )
}
