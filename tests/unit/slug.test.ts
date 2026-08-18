import { describe, expect, it } from 'vitest'
import { slugify } from '../../shared/utils/slug'

describe('slugify', () => {
  it('deixa minúsculo e troca espaços por hífen', () => {
    expect(slugify('Meu Primeiro Post')).toBe('meu-primeiro-post')
  })

  it('remove acentos', () => {
    expect(slugify('Acessibilidade e Padrões de Código')).toBe('acessibilidade-e-padroes-de-codigo')
  })

  it('remove caracteres que não são letras/números', () => {
    expect(slugify('Vue.js & Nuxt: guia completo!')).toBe('vue-js-nuxt-guia-completo')
  })

  it('remove hífens duplicados nas bordas', () => {
    expect(slugify('  --Título--  ')).toBe('titulo')
  })

  it('string vazia gera slug vazio', () => {
    expect(slugify('')).toBe('')
  })
})
