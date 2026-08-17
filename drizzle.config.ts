import { defineConfig } from 'drizzle-kit'

process.loadEnvFile('.env')

export default defineConfig({
  schema: './server/database/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})
