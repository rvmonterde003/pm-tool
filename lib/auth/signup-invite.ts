import { randomBytes } from 'crypto'

export const SIGNUP_INVITE_TTL_MS = 24 * 60 * 60 * 1000

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function generateInviteKey() {
  return randomBytes(6).toString('hex').toUpperCase()
}

export function inviteExpiresAt(from = new Date()) {
  return new Date(from.getTime() + SIGNUP_INVITE_TTL_MS)
}

export function isInviteActive(expiresAt: string, usedAt: string | null) {
  return !usedAt && new Date(expiresAt) > new Date()
}
