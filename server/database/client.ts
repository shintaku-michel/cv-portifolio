import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// DATABASE_URL é a fonte de verdade em dev/scripts locais e no drizzle-kit
// (conexão TCP comum). Em produção no Cloud Run, a conexão com o Cloud SQL
// é feita via socket Unix montado em /cloudsql/<connection-name> — a lib
// `postgres` só ativa esse modo quando `host` (não uma query string) aponta
// pra esse diretório, por isso usamos DB_SOCKET_PATH + credenciais
// separadas nesse caso em vez de uma DATABASE_URL.
if (!process.env.DATABASE_URL && !process.env.DB_SOCKET_PATH) {
  process.loadEnvFile('.env')
}

const queryClient = process.env.DB_SOCKET_PATH
  ? postgres({
      host: process.env.DB_SOCKET_PATH,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    })
  : postgres(process.env.DATABASE_URL!)

export const db = drizzle(queryClient, { schema })
