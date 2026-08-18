import { createSchema } from 'graphql-yoga'
import type { GraphQLContext } from '../context'
import { resolvers } from '../resolvers'

const SCHEMA_FILES = ['schema', 'user', 'technology', 'category', 'project', 'post', 'comment', 'like']

// Em dev o asset driver (fs) retorna string; no build de produção os
// server assets são embutidos como bytes (Uint8Array), por isso decodifica.
function toText(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }
  if (value instanceof Uint8Array) {
    return new TextDecoder().decode(value)
  }
  throw new TypeError('Formato inesperado para asset de schema GraphQL')
}

export async function loadSchema() {
  const storage = useStorage('assets:graphql')
  const typeDefs = await Promise.all(
    SCHEMA_FILES.map(async (name) => {
      const content = await storage.getItem<string | Uint8Array>(`${name}.graphql`)
      if (!content) {
        throw new Error(`GraphQL schema asset não encontrado: ${name}.graphql`)
      }
      return toText(content)
    })
  )

  return createSchema<GraphQLContext>({ typeDefs, resolvers })
}
