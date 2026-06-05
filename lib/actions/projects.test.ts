import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/headers', () => ({ cookies: vi.fn(() => ({ getAll: () => [], setAll: () => {} })) }))

import { createProject, updateProgress } from './projects'
import { createClient } from '@/lib/supabase/server'

describe('createProject', () => {
  it('returns error when name is empty', async () => {
    const result = await createProject({ name: '', coverFile: null })
    expect(result.error).toBe('Project name is required.')
  })
})

describe('updateProgress', () => {
  it('returns error when progress is out of range', async () => {
    const result = await updateProgress({ projectId: 'abc', progress: 150 })
    expect(result.error).toBe('Progress must be between 0 and 100.')
  })
})
