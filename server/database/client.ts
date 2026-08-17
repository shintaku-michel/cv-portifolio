import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// DATABASE_URL é a única fonte de verdade (mesma var usada por drizzle-kit).
// Em produção o host injeta a env diretamente; em dev/scripts locais cai
// para o .env.
if (!process.env.DATABASE_URL) {
  process.loadEnvFile('.env')
}

const queryClient = postgres(process.env.DATABASE_URL!)

export const db = drizzle(queryClient, { schema })
