import { describe, it, expect } from 'vitest'
import { getCurrentMonday, getWeekRange } from './week'

describe('getCurrentMonday', () => {
  it('returns a Monday for a Wednesday input', () => {
    // 2026-06-03 is a Wednesday
    const result = getCurrentMonday(new Date('2026-06-03'))
    expect(result).toBe('2026-06-01') // Monday
  })

  it('returns the same day when input is a Monday', () => {
    const result = getCurrentMonday(new Date('2026-06-01'))
    expect(result).toBe('2026-06-01')
  })

  it('returns the correct Monday for a Sunday (end of week)', () => {
    // 2026-06-07 is a Sunday
    const result = getCurrentMonday(new Date('2026-06-07'))
    expect(result).toBe('2026-06-01')
  })
})

describe('getWeekRange', () => {
  it('returns Mon–Sun range string for a given Monday', () => {
    const result = getWeekRange('2026-06-01')
    expect(result).toBe('Jun 1 – Jun 7, 2026')
  })
})
