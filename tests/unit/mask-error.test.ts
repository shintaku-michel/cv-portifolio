import { createError } from 'h3'
import { describe, expect, it } from 'vitest'
import { maskError } from '../../server/graphql/mask-error'

describe('maskError', () => {
  it('preserva a mensagem original para erros de cliente (< 500)', () => {
    const error = createError({ statusCode: 403, message: 'Acesso restrito a administradores' })
    const result = maskError(error, 'Unexpected error.')

    expect(result.message).toBe('Acesso restrito a administradores')
    expect(result.extensions?.code).toBe(403)
  })

  it('mascara erros inesperados (>= 500)', () => {
    const error = createError({ statusCode: 500, message: 'Detalhe interno sensível' })
    const result = maskError(error, 'Unexpected error.')

    expect(result.message).toBe('Unexpected error.')
  })

  it('mascara erros genéricos sem statusCode', () => {
    const error = new Error('Falha de conexão com o banco')
    const result = maskError(error, 'Unexpected error.')

    expect(result.message).toBe('Unexpected error.')
  })

  it('preserva a mensagem quando o erro real está em originalError (erro envolvido pelo graphql-js)', () => {
    const wrapped = { originalError: createError({ statusCode: 404, message: 'Post não encontrado' }) }
    const result = maskError(wrapped, 'Unexpected error.')

    expect(result.message).toBe('Post não encontrado')
    expect(result.extensions?.code).toBe(404)
  })
})
