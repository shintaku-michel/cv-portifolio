import { GraphQLScalarType, Kind } from 'graphql'

// GraphQLString serializa Date via valueOf() (epoch em ms), não toJSON()
// (ISO), então createdAt/updatedAt/publishedAt precisam de um scalar próprio.
export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Data/hora em formato ISO 8601 (UTC).',

  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString()
    }
    if (typeof value === 'string') {
      return new Date(value).toISOString()
    }
    throw new TypeError('DateTime scalar só aceita Date ou string ISO')
  },

  parseValue(value: unknown): Date {
    if (typeof value !== 'string') {
      throw new TypeError('DateTime scalar espera uma string ISO 8601')
    }
    return new Date(value)
  },

  parseLiteral(ast): Date {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError('DateTime scalar espera uma string literal ISO 8601')
    }
    return new Date(ast.value)
  }
})
