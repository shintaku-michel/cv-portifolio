import { eq, inArray } from 'drizzle-orm'
import { AuthService } from '../services/auth.service'
import { slugify } from '../../shared/utils/slug'
import { db } from './client'
import { categories, projects, projectTechnologies, tags, technologies, users } from './schema'

// Dados de referência (tecnologias, categorias, tags), um projeto de exemplo
// e dois usuários de teste (ADMIN e USER) para exercitar o login localmente.
// Posts/comentários/likes com autor real ficam para quando o CRUD de posts
// existir (M6).

// Categoria de cada tecnologia, usada para agrupar o checklist no formulário
// de cadastro de projetos (server/database/schema/technologies.ts tem o enum).
//
// "Java EE / Jakarta EE" e "JBoss / WildFly" viraram só "Jakarta EE" e
// "WildFly" (nomes atuais dos projetos) — nome com "/" gera slug estranho
// e um único cadastro já cobre o significado histórico.
type TechnologyCategoryValue = (typeof technologies.category.enumValues)[number]
const technologyCatalog: { name: string, category: TechnologyCategoryValue }[] = [
  // Frontend
  { name: 'HTML5', category: 'FRONTEND' },
  { name: 'CSS3', category: 'FRONTEND' },
  { name: 'JavaScript', category: 'FRONTEND' },
  { name: 'TypeScript', category: 'FRONTEND' },
  { name: 'Vue.js', category: 'FRONTEND' },
  { name: 'Nuxt', category: 'FRONTEND' },
  { name: 'React', category: 'FRONTEND' },
  { name: 'Next.js', category: 'FRONTEND' },
  { name: 'Angular', category: 'FRONTEND' },
  { name: 'Tailwind CSS', category: 'FRONTEND' },
  { name: 'Bootstrap', category: 'FRONTEND' },
  { name: 'Sass', category: 'FRONTEND' },
  { name: 'Pinia', category: 'FRONTEND' },
  { name: 'Redux', category: 'FRONTEND' },
  { name: 'Chart.js', category: 'FRONTEND' },
  { name: 'jsPDF', category: 'FRONTEND' },
  // Backend
  { name: 'Node.js', category: 'BACKEND' },
  { name: 'Express', category: 'BACKEND' },
  { name: 'NestJS', category: 'BACKEND' },
  { name: 'Fastify', category: 'BACKEND' },
  { name: 'Java', category: 'BACKEND' },
  { name: 'Spring', category: 'BACKEND' },
  { name: 'Spring Boot', category: 'BACKEND' },
  { name: 'Spring MVC', category: 'BACKEND' },
  { name: 'Jakarta EE', category: 'BACKEND' },
  // APIs & Comunicação
  { name: 'REST', category: 'API' },
  { name: 'GraphQL', category: 'API' },
  { name: 'Apollo Client', category: 'API' },
  { name: 'WebSocket', category: 'API' },
  { name: 'SSE', category: 'API' },
  { name: 'SOAP', category: 'API' },
  { name: 'Web Services', category: 'API' },
  // Banco de Dados
  { name: 'PostgreSQL', category: 'DATABASE' },
  { name: 'MySQL', category: 'DATABASE' },
  { name: 'MongoDB', category: 'DATABASE' },
  { name: 'SQLite', category: 'DATABASE' },
  { name: 'Redis', category: 'DATABASE' },
  // ORM & Persistência
  { name: 'Prisma', category: 'ORM' },
  { name: 'Drizzle', category: 'ORM' },
  { name: 'Hibernate', category: 'ORM' },
  { name: 'JPA', category: 'ORM' },
  // Cloud & Deploy
  { name: 'AWS', category: 'CLOUD' },
  { name: 'Azure', category: 'CLOUD' },
  { name: 'Google Cloud', category: 'CLOUD' },
  { name: 'Cloudflare', category: 'CLOUD' },
  { name: 'Firebase', category: 'CLOUD' },
  { name: 'Vercel', category: 'CLOUD' },
  { name: 'Netlify', category: 'CLOUD' },
  // DevOps & CI/CD
  { name: 'Docker', category: 'DEVOPS' },
  { name: 'Kubernetes', category: 'DEVOPS' },
  { name: 'GitHub Actions', category: 'DEVOPS' },
  { name: 'Jenkins', category: 'DEVOPS' },
  { name: 'Google Cloud Build', category: 'DEVOPS' },
  // Build & Dependências
  { name: 'Maven', category: 'BUILD_TOOLS' },
  { name: 'Gradle', category: 'BUILD_TOOLS' },
  { name: 'npm', category: 'BUILD_TOOLS' },
  { name: 'pnpm', category: 'BUILD_TOOLS' },
  { name: 'Yarn', category: 'BUILD_TOOLS' },
  { name: 'Vite', category: 'BUILD_TOOLS' },
  // Testes
  { name: 'Jest', category: 'TESTING' },
  { name: 'Vitest', category: 'TESTING' },
  { name: 'Cypress', category: 'TESTING' },
  { name: 'Playwright', category: 'TESTING' },
  { name: 'JUnit', category: 'TESTING' },
  { name: 'Mockito', category: 'TESTING' },
  // IA — plataforma/tecnologia, não o modelo específico (ex: informar a
  // versão do modelo na descrição do projeto, não aqui).
  { name: 'Gemini', category: 'AI' },
  { name: 'OpenAI', category: 'AI' },
  { name: 'LangChain', category: 'AI' },
  // Segurança & Autenticação
  { name: 'JWT', category: 'SECURITY' },
  { name: 'OAuth 2.0', category: 'SECURITY' },
  { name: 'OpenID Connect', category: 'SECURITY' },
  { name: 'Google OAuth', category: 'SECURITY' },
  { name: 'Spring Security', category: 'SECURITY' },
  // Pagamentos
  { name: 'Stripe', category: 'PAYMENTS' },
  { name: 'Mercado Pago', category: 'PAYMENTS' },
  { name: 'PayPal', category: 'PAYMENTS' },
  // Arquitetura & Padrões
  { name: 'MVC', category: 'ARCHITECTURE' },
  { name: 'Arquitetura em Camadas', category: 'ARCHITECTURE' },
  { name: 'Clean Architecture', category: 'ARCHITECTURE' },
  { name: 'Hexagonal Architecture', category: 'ARCHITECTURE' },
  { name: 'Microsserviços', category: 'ARCHITECTURE' },
  { name: 'Monolito', category: 'ARCHITECTURE' },
  { name: 'DDD', category: 'ARCHITECTURE' },
  { name: 'Repository Pattern', category: 'ARCHITECTURE' },
  { name: 'Dependency Injection', category: 'ARCHITECTURE' },
  // Servidores & Infraestrutura
  { name: 'Nginx', category: 'INFRASTRUCTURE' },
  { name: 'Apache HTTP Server', category: 'INFRASTRUCTURE' },
  { name: 'Tomcat', category: 'INFRASTRUCTURE' },
  { name: 'WildFly', category: 'INFRASTRUCTURE' },
  // Versionamento & Repositórios
  { name: 'Git', category: 'VERSION_CONTROL' },
  { name: 'GitHub', category: 'VERSION_CONTROL' },
  { name: 'GitLab', category: 'VERSION_CONTROL' },
  { name: 'Bitbucket', category: 'VERSION_CONTROL' },
  // Observabilidade
  { name: 'Sentry', category: 'OBSERVABILITY' },
  { name: 'Prometheus', category: 'OBSERVABILITY' },
  { name: 'Grafana', category: 'OBSERVABILITY' }
]

// Tecnologias renomeadas desde a última rodada do seed — atualiza o registro
// existente (preserva id e vínculos com projetos) em vez de deixar o antigo
// órfão enquanto um novo é inserido por baixo do upsert por slug.
const technologyRenames: { fromSlug: string, toName: string }[] = [
  { fromSlug: 'vue', toName: 'Vue.js' },
  { fromSlug: 'mercadopago', toName: 'Mercado Pago' },
  { fromSlug: 'cloud-build', toName: 'Google Cloud Build' }
]

// "httpOnly" não é uma tecnologia — é um atributo de cookie. Cadastro
// removido; a informação pertence à descrição técnica do projeto.
const technologySlugsToRemove = ['httponly']

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

async function seedTechnologies() {
  // Renomeações: atualiza o registro existente por baixo do slug antigo
  // antes do upsert, para preservar id e vínculos com projetos.
  for (const rename of technologyRenames) {
    await db
      .update(technologies)
      .set({ name: rename.toName, slug: slugify(rename.toName) })
      .where(eq(technologies.slug, rename.fromSlug))
  }

  if (technologySlugsToRemove.length > 0) {
    await db.delete(technologies).where(inArray(technologies.slug, technologySlugsToRemove))
  }

  // onConflictDoUpdate (não onConflictDoNothing): permite corrigir a
  // categoria de tecnologias já existentes ao rodar o seed de novo.
  for (const tech of technologyCatalog) {
    await db
      .insert(technologies)
      .values({ name: tech.name, slug: slugify(tech.name), category: tech.category })
      .onConflictDoUpdate({ target: technologies.slug, set: { category: tech.category } })
  }
}

async function seed() {
  await seedTechnologies()
  const allTechnologies = await db.select().from(technologies)

  await db
    .insert(categories)
    .values(categoryNames.map(name => ({ name, slug: slugify(name) })))
    .onConflictDoNothing({ target: categories.slug })

  await db
    .insert(tags)
    .values(tagNames.map(name => ({ name, slug: slugify(name) })))
    .onConflictDoNothing({ target: tags.slug })

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
      isOnline: true,
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
        ['Vue.js', 'Nuxt', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Drizzle', 'Tailwind CSS'].map(name => ({
          projectId: portfolioProject.id,
          technologyId: byName(name)
        }))
      )
      .onConflictDoNothing()
  }

  // Contas de teste com senha fixa e conhecida — só em dev. Em produção
  // (NODE_ENV=production) ficam de fora por padrão; force com
  // SEED_DEMO_ACCOUNTS=true se precisar delas lá mesmo assim.
  if (process.env.NODE_ENV !== 'production' || process.env.SEED_DEMO_ACCOUNTS === 'true') {
    await seedUsers()
  }
  await promoteOwnerToAdmin()

  console.log('Seed concluído: technologies, categories, tags, projeto de exemplo e usuários.')
  await db.$client.end()
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
