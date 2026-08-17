import { eq } from 'drizzle-orm'
import { AuthService } from '../services/auth.service'
import { slugify } from '../utils/slug'
import { db } from './client'
import { categories, projects, projectTechnologies, tags, technologies, users } from './schema'

// Dados de referência (tecnologias, categorias, tags), um projeto de exemplo
// e dois usuários de teste (ADMIN e USER) para exercitar o login localmente.
// Posts/comentários/likes com autor real ficam para quando o CRUD de posts
// existir (M6).

const technologyNames = ['Vue', 'Nuxt', 'TypeScript', 'JavaScript', 'GraphQL', 'PostgreSQL', 'Drizzle', 'Tailwind CSS', 'Docker']

const categoryNames = ['Vue', 'Nuxt', 'TypeScript', 'Frontend', 'Backend', 'Acessibilidade', 'Design Systems', 'JavaScript']

const tagNames = ['Tutorial', 'Estudo de caso', 'Arquitetura', 'Performance', 'Boas práticas']

async function seedUsers() {
  const seedAccounts = [
    { name: 'Admin', email: 'admin@portfolio-cms.dev', password: 'admin12345', role: 'ADMIN' as const },
    { name: 'Leitor', email: 'leitor@portfolio-cms.dev', password: 'leitor12345', role: 'USER' as const }
  ]

  for (const account of seedAccounts) {
    try {
      await AuthService.register(account)
      console.log(`  usuário criado: ${account.email} (${account.role}) — senha: ${account.password}`)
    } catch {
      // usuário já existe (email é unique) — seed idempotente, segue em frente.
    }
  }
}

// Promove o dono do portfólio a ADMIN quando ele já tiver se cadastrado
// via /registro. Não cria a conta (a senha real é dele, não nossa) —
// só ajusta a role se OWNER_EMAIL estiver definido no .env.
async function promoteOwnerToAdmin() {
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase()
  if (!ownerEmail) {
    return
  }

  const [promoted] = await db
    .update(users)
    .set({ role: 'ADMIN' })
    .where(eq(users.email, ownerEmail))
    .returning()

  if (promoted) {
    console.log(`  usuário promovido a ADMIN: ${promoted.email}`)
  }
}

async function seed() {
  const insertedTechnologies = await db
    .insert(technologies)
    .values(technologyNames.map(name => ({ name, slug: slugify(name) })))
    .onConflictDoNothing({ target: technologies.slug })
    .returning()

  await db
    .insert(categories)
    .values(categoryNames.map(name => ({ name, slug: slugify(name) })))
    .onConflictDoNothing({ target: categories.slug })

  await db
    .insert(tags)
    .values(tagNames.map(name => ({ name, slug: slugify(name) })))
    .onConflictDoNothing({ target: tags.slug })

  const allTechnologies = insertedTechnologies.length > 0
    ? insertedTechnologies
    : await db.select().from(technologies)

  const byName = (name: string) => allTechnologies.find(t => t.name === name)!.id

  const [portfolioProject] = await db
    .insert(projects)
    .values({
      title: 'Portfolio CMS',
      slug: 'portfolio-cms',
      shortDescription: 'Portfólio pessoal com blog, projetos e painel administrativo.',
      description: 'Monólito modular construído com Nuxt 4, GraphQL, Drizzle ORM e PostgreSQL, com autenticação por sessão, moderação de comentários e painel administrativo completo.',
      status: 'PUBLISHED',
      featured: true,
      displayOrder: 1,
      repositoryUrl: 'https://github.com/michelshintaku/portfolio-cms',
      startDate: '2026-08-16'
    })
    .onConflictDoNothing({ target: projects.slug })
    .returning()

  if (portfolioProject) {
    await db
      .insert(projectTechnologies)
      .values(
        ['Vue', 'Nuxt', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Drizzle', 'Tailwind CSS'].map(name => ({
          projectId: portfolioProject.id,
          technologyId: byName(name)
        }))
      )
      .onConflictDoNothing()
  }

  await seedUsers()
  await promoteOwnerToAdmin()

  console.log('Seed concluído: technologies, categories, tags, projeto de exemplo e usuários.')
  await db.$client.end()
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
