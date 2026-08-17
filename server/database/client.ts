import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const config = useRuntimeConfig()
const queryClient = postgres(config.databaseUrl)

export const db = drizzle(queryClient, { schema })
