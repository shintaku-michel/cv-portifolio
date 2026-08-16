import { describe, expect, it } from 'vitest'
import { cn } from '../../app/lib/utils'

describe('cn', () => {
  it('merges class names and resolves Tailwind conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('drops falsy values', () => {
    expect(cn('foo', false, undefined, 'bar')).toBe('foo bar')
  })
})
