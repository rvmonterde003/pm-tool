import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { signupInviteEmail } from '@/lib/auth/email-templates'
import {
  generateInviteKey,
  inviteExpiresAt,
  normalizeEmail,
} from '@/lib/auth/signup-invite'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 503 })
  }

  const { email: rawEmail } = await request.json()
  if (!rawEmail || typeof rawEmail !== 'string') {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  const email = normalizeEmail(rawEmail)
  const inviteKey = generateInviteKey()
  const expiresAt = inviteExpiresAt()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const signupUrl = `${appUrl}/signup?email=${encodeURIComponent(email)}&key=${encodeURIComponent(inviteKey)}`

  const admin = createAdminClient()

  await admin
    .from('signup_invites')
    .update({ expires_at: new Date().toISOString() })
    .eq('email', email)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())

  const { error: insertError } = await admin.from('signup_invites').insert({
    email,
    invite_key: inviteKey,
    expires_at: expiresAt.toISOString(),
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  const resend = new Resend(resendKey)
  const { error: emailError } = await resend.emails.send({
    from: 'Realign <onboarding@resend.dev>',
    to: email,
    subject: 'Your Realign sign-up invite',
    html: signupInviteEmail({ signupUrl, inviteKey }),
  })

  if (emailError) {
    return NextResponse.json({ error: emailError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
