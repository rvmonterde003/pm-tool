import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { email, token } = await request.json()

  if (!email || !token) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`

  const { error } = await resend.emails.send({
    from: 'Realign <onboarding@resend.dev>',
    to: email,
    subject: "You've been invited to a Realign project",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: 900; color: #f0f0f0;">Realign</h1>
        <p style="color: #6b6b6b;">You've been invited to collaborate on a project.</p>
        <a href="${inviteUrl}"
           style="display: inline-block; margin-top: 16px; padding: 12px 24px;
                  background: #ff6b00; color: #000; font-weight: 600;
                  border-radius: 8px; text-decoration: none;">
          Accept invite
        </a>
        <p style="margin-top: 24px; font-size: 12px; color: #6b6b6b;">
          Or copy this link: ${inviteUrl}
        </p>
      </div>
    `,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
