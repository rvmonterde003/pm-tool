import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/headers', () => ({ cookies: vi.fn(() => ({ getAll: () => [], setAll: () => {} })) }))

import { createEntry } from './entries'

describe('createEntry', () => {
  it('returns error when all three text fields are empty', async () => {
    const result = await createEntry({
      projectId: 'proj-1',
      whatShipped: '',
      whatSlipped: '',
      whatsBlocking: '',
      attachments: [],
    })
    expect(result.error).toBe('At least one field (shipped, slipped, or blocking) is required.')
  })
})
