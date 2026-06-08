import { NextResponse } from 'next/server'
import { isInviteActive, normalizeEmail } from '@/lib/auth/signup-invite'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const body = await request.json()
  const email = typeof body.email === 'string' ? normalizeEmail(body.email) : ''
  const inviteKey = typeof body.inviteKey === 'string' ? body.inviteKey.trim().toUpperCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const passwordConfirm = typeof body.passwordConfirm === 'string' ? body.passwordConfirm : ''

  if (!email || !inviteKey || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  if (password !== passwordConfirm) {
    return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: invite, error: inviteError } = await admin
    .from('signup_invites')
    .select('id, email, expires_at, used_at')
    .eq('invite_key', inviteKey)
    .maybeSingle()

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 })
  }

  if (!invite) {
    return NextResponse.json({ error: 'Invalid invite key.' }, { status: 400 })
  }

  if (normalizeEmail(invite.email) !== email) {
    return NextResponse.json({ error: 'Invite key does not match this email.' }, { status: 400 })
  }

  if (!isInviteActive(invite.expires_at, invite.used_at)) {
    return NextResponse.json({ error: 'This invite key has expired or was already used.' }, { status: 400 })
  }

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError) {
    if (createError.message.toLowerCase().includes('already')) {
      return NextResponse.json({ error: 'An account with this email already exists. Sign in instead.' }, { status: 409 })
    }
    return NextResponse.json({ error: createError.message }, { status: 400 })
  }

  const { error: markUsedError } = await admin
    .from('signup_invites')
    .update({ used_at: new Date().toISOString() })
    .eq('id', invite.id)

  if (markUsedError) {
    return NextResponse.json({ error: markUsedError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
