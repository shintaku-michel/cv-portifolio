import { defineConfig } from 'drizzle-kit'

// Em CI/produção, DATABASE_URL já vem do ambiente — sem .env pra carregar
// (o arquivo é gitignored, não existe no checkout).
if (!process.env.DATABASE_URL) {
  process.loadEnvFile('.env')
}

export default defineConfig({
  schema: './server/database/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})
