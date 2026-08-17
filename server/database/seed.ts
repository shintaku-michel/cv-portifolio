import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { categories, projects, projectTechnologies, tags, technologies } from './schema'

process.loadEnvFile('.env')

const queryClient = postgres(process.env.DATABASE_URL!)
const db = drizzle(queryClient, { schema: { categories, projects, projectTechnologies, tags, technologies } })

// Dados de referência (tecnologias, categorias, tags) e projetos de exemplo.
// Posts/comentários/likes exigem um usuário autor e ficam para o seed do M3,
// quando autenticação existir.

const technologyNames = ['Vue', 'Nuxt', 'TypeScript', 'JavaScript', 'GraphQL', 'PostgreSQL', 'Drizzle', 'Tailwind CSS', 'Docker']

const categoryNames = ['Vue', 'Nuxt', 'TypeScript', 'Frontend', 'Backend', 'Acessibilidade', 'Design Systems', 'JavaScript']

const tagNames = ['Tutorial', 'Estudo de caso', 'Arquitetura', 'Performance', 'Boas práticas']

const DIACRITICS_REGEX = /[̀-ͯ]/g

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
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

  console.log('Seed concluído: technologies, categories, tags e projeto de exemplo.')
  await queryClient.end()
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
