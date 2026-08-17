import { defineEventHandler } from 'h3'
import { getCurrentUser } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  return { user }
})
