import type { H3Event } from 'h3'
import type { SessionUser } from '../../shared/types/auth'
import { getCurrentUser } from '../utils/session'

export type UserContext = {
  user: SessionUser | null
}

export type GraphQLContext = UserContext & {
  event: H3Event
}

export async function createGraphQLContext(event: H3Event): Promise<UserContext> {
  const user = await getCurrentUser(event)
  return { user }
}
