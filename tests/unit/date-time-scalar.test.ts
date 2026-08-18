import { Kind } from 'graphql'
import { describe, expect, it } from 'vitest'
import { DateTimeScalar } from '../../server/graphql/scalars/date-time'

describe('DateTimeScalar', () => {
  it('serializa Date para ISO 8601', () => {
    const date = new Date('2026-08-17T12:00:00.000Z')
    expect(DateTimeScalar.serialize(date)).toBe('2026-08-17T12:00:00.000Z')
  })

  it('serializa string para ISO 8601', () => {
    expect(DateTimeScalar.serialize('2026-08-17T12:00:00.000Z')).toBe('2026-08-17T12:00:00.000Z')
  })

  it('rejeita valores que não são Date nem string', () => {
    expect(() => DateTimeScalar.serialize(12345)).toThrow(TypeError)
  })

  it('parseValue converte string ISO em Date', () => {
    const result = DateTimeScalar.parseValue('2026-08-17T12:00:00.000Z')
    expect(result).toBeInstanceOf(Date)
    expect((result as Date).toISOString()).toBe('2026-08-17T12:00:00.000Z')
  })

  it('parseValue rejeita valores não-string', () => {
    expect(() => DateTimeScalar.parseValue(12345)).toThrow(TypeError)
  })

  it('parseLiteral converte um literal string do AST em Date', () => {
    const result = DateTimeScalar.parseLiteral(
      { kind: Kind.STRING, value: '2026-08-17T12:00:00.000Z' },
      null
    )
    expect(result).toBeInstanceOf(Date)
  })

  it('parseLiteral rejeita literais que não são string', () => {
    expect(() => DateTimeScalar.parseLiteral({ kind: Kind.INT, value: '123' }, null)).toThrow(TypeError)
  })
})
