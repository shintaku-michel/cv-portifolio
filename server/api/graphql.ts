import type { H3Event } from 'h3'
import type { YogaServerInstance } from 'graphql-yoga'
import { createYoga } from 'graphql-yoga'
import { defineEventHandler, sendWebResponse, toWebRequest } from 'h3'
import type { UserContext } from '../graphql/context'
import { createGraphQLContext } from '../graphql/context'
import { maskError } from '../graphql/mask-error'
import { loadSchema } from '../graphql/schema'

let yogaPromise: Promise<YogaServerInstance<{ event: H3Event }, UserContext>> | undefined

function getYoga() {
  yogaPromise ??= loadSchema().then(schema =>
    createYoga<{ event: H3Event }, UserContext>({
      schema,
      graphqlEndpoint: '/api/graphql',
      context: ({ event }) => createGraphQLContext(event),
      maskedErrors: { maskError }
    })
  )
  return yogaPromise
}

export default defineEventHandler(async (event) => {
  const yoga = await getYoga()
  const response = await yoga.fetch(toWebRequest(event), { event })
  return sendWebResponse(event, response)
})
