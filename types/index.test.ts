import { describe, it, expectTypeOf } from 'vitest'
import type { Project, Entry, Profile } from './index'

describe('types', () => {
  it('Project has required fields', () => {
    expectTypeOf<Project>().toHaveProperty('id')
    expectTypeOf<Project>().toHaveProperty('name')
    expectTypeOf<Project>().toHaveProperty('progress')
    expectTypeOf<Project>().toHaveProperty('cover_url')
  })

  it('Entry has week_start and three text fields', () => {
    expectTypeOf<Entry>().toHaveProperty('week_start')
    expectTypeOf<Entry>().toHaveProperty('what_shipped')
    expectTypeOf<Entry>().toHaveProperty('what_slipped')
    expectTypeOf<Entry>().toHaveProperty('whats_blocking')
  })
})
