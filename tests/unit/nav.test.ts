import { describe, expect, it } from 'vitest'
import { isNavItemActive } from '../../app/utils/nav'

describe('isNavItemActive', () => {
  it('matches the root only exactly', () => {
    expect(isNavItemActive('/', ['/'])).toBe(true)
    expect(isNavItemActive('/perfil', ['/'])).toBe(false)
  })

  it('matches the exact path and its subroutes', () => {
    expect(isNavItemActive('/projetos', ['/projetos'])).toBe(true)
    expect(isNavItemActive('/projetos/meu-projeto', ['/projetos'])).toBe(true)
  })

  it('ignores a trailing slash', () => {
    expect(isNavItemActive('/perfil/', ['/perfil'])).toBe(true)
  })

  it('does not match a path that only shares the prefix text', () => {
    expect(isNavItemActive('/postsx', ['/posts'])).toBe(false)
  })

  it('matches any of the related routes of an item', () => {
    const formacao = ['/formacao', '/graduacao', '/pos-graduacao']
    expect(isNavItemActive('/pos-graduacao', formacao)).toBe(true)
    expect(isNavItemActive('/cursos', formacao)).toBe(false)
  })
})
