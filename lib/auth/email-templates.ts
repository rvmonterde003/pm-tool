export function signupInviteEmail({
  signupUrl,
  inviteKey,
}: {
  signupUrl: string
  inviteKey: string
}) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #f0f0f0; background: #111; padding: 32px; border-radius: 12px;">
      <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 8px;">Realign</h1>
      <p style="color: #9ca3af; margin: 0 0 24px;">Complete your account setup within 24 hours.</p>
      <a href="${signupUrl}"
         style="display: inline-block; padding: 12px 24px; background: #ff6b00; color: #000;
                font-weight: 600; border-radius: 8px; text-decoration: none;">
        Open sign-up page
      </a>
      <div style="margin-top: 32px; padding: 16px; background: #1a1a1a; border-radius: 8px; border: 1px solid #333;">
        <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em;">
          Your invite key
        </p>
        <p style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.15em; font-family: monospace;">
          ${inviteKey}
        </p>
        <p style="margin: 12px 0 0; font-size: 13px; color: #9ca3af;">
          Copy and paste this key on the sign-up page along with your email and password.
        </p>
      </div>
      <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">
        This invite expires in 24 hours. Sign-up link:<br />
        <span style="word-break: break-all;">${signupUrl}</span>
      </p>
    </div>
  `
}
