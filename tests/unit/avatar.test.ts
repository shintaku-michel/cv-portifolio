import { describe, expect, it } from 'vitest'
import { googleAvatarAtSize } from '../../app/utils/avatar'

describe('googleAvatarAtSize', () => {
  it('replaces the size suffix of a Google photo', () => {
    expect(googleAvatarAtSize('https://lh3.googleusercontent.com/a/abc=s96-c', 400))
      .toBe('https://lh3.googleusercontent.com/a/abc=s400-c')
  })

  it('keeps Google photos without a size suffix', () => {
    expect(googleAvatarAtSize('https://lh3.googleusercontent.com/a/abc', 400))
      .toBe('https://lh3.googleusercontent.com/a/abc')
  })

  it('keeps URLs from other hosts', () => {
    expect(googleAvatarAtSize('https://example.com/me=s96-c', 400)).toBe('https://example.com/me=s96-c')
  })
})
