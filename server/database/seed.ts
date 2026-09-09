import { eq, inArray } from 'drizzle-orm'
import { AuthService } from '../services/auth.service'
import { slugify } from '../../shared/utils/slug'
import { db } from './client'
import { categories, certificates, projects, projectTechnologies, tags, technologies, users } from './schema'
import type { CertificateCategory } from '../services/certificate.service'

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
  { name: 'Swagger UI', category: 'API' },
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

// Imagens servidas de `public/certificados/` (não `assets/`, que exigiria
// import processado pelo Vite — aqui é só uma URL de texto, como coverImage
// de projeto/post). displayOrder preserva a ordem cronológica original.
const certificateCatalog: {
  title: string
  description: string
  category: CertificateCategory
  completedAt: string
  image: string
  onlineUrl: string | null
  displayOrder: number
}[] = [
  {
    title: 'Figma for Devs',
    description: 'Um curso de Figma para quem é dev front-end, a fim de te ensinar a como utilizar o Figma de forma produtiva na hora de migrar um projeto de UI para código HTML/CSS.',
    category: 'UX_UI_DESIGN',
    completedAt: '2026-05-11',
    image: '/certificados/certificado-figma.png',
    onlineUrl: 'https://ftr.rocketseat.com.br/certificates/600d9c9f-fac3-44bc-8434-7aaf26ec366e',
    displayOrder: 1
  },
  {
    title: 'Desenvolvimento de Software com IA Aplicada e Alta Performance',
    description: 'Curso voltado à construção e evolução de produtos digitais escaláveis, abordando gestão de projetos e riscos, observabilidade, privacidade de dados, estratégias de deploy e GraphQL, além do uso de Inteligência Artificial e dados na tomada de decisões',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2026-03-03',
    image: '/certificados/dev-web.png',
    onlineUrl: 'https://app.rocketseat.com.br/certificates/f6741d91-5fcc-4954-870a-255d3d002f24',
    displayOrder: 2
  },
  {
    title: 'Arquitetura de Software e Sistemas Escaláveis',
    description: 'Curso voltado a práticas avançadas de engenharia de software, abordando arquitetura, Design Patterns, testes, bancos de dados, microsserviços e Kubernetes, além da aplicação de Inteligência Artificial, gestão de projetos e inovação no desenvolvimento de soluções modernas.',
    category: 'DEVOPS',
    completedAt: '2026-02-09',
    image: '/certificados/devOps-02.png',
    onlineUrl: 'https://app.rocketseat.com.br/certificates/ef1df7aa-c1bf-4d5b-8c37-f9125cc5b9be',
    displayOrder: 3
  },
  {
    title: 'Desenvolvimento Web Full Stack, Cloud, DevOps e IA',
    description: 'Desenvolvimento de aplicações modernas com foco em infraestrutura, deploy, produtividade e Inteligência Artificial.',
    category: 'DEVOPS',
    completedAt: '2025-10-13',
    image: '/certificados/dev-web-full-stack.png',
    onlineUrl: 'https://app.rocketseat.com.br/certificates/bf3924fc-5956-43af-8661-d4799f0fe92a',
    displayOrder: 4
  },
  {
    title: 'Node.js',
    description: 'Curso focado nos fundamentos do desenvolvimento Backend com Node.js. Explorando o funcionamento do protocolo HTTP, manipulação de requisições e respostas, headers, status codes, parâmetros e processamento de dados com Streams',
    category: 'BACKEND',
    completedAt: '2024-12-22',
    image: '/certificados/nodejs.png',
    onlineUrl: 'https://app.rocketseat.com.br/certificates/cd3f8afe-bf19-4992-b13a-2d22f35a03c5',
    displayOrder: 5
  },
  {
    title: 'Vue 3 full course in one day + helpful docs (Cheat Sheet)',
    description: 'Curso completo de Vue 3, abordando desde os fundamentos do framework até a criação de aplicações web complexas, incluindo práticas recomendadas e padrões de desenvolvimento.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2023-06-18',
    image: '/certificados/vue3.png',
    onlineUrl: 'https://www.udemy.com/certificate/UC-2b9d7190-4465-4e5a-81ae-4870a99fc468/',
    displayOrder: 6
  },
  {
    title: 'Criando um Projeto com Interface Gráfica Utilizando a Linguagem Python',
    description: 'Curso introdutório de desenvolvimento com Python, abordando classes e métodos, encapsulamento, criação de bibliotecas e desenvolvimento de aplicações, incluindo a construção de interfaces com Kivy.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2023-06-14',
    image: '/certificados/python.png',
    onlineUrl: null,
    displayOrder: 7
  },
  {
    title: 'Linguagem de Programação Java - Avançado',
    description: 'Os fundamentos da Programação Orientada a Objetos (POO) serão evidenciados, passando pelos objetos, as classes, suas construções, além dos complementos da linguagem Java, incluindo conceitos, como pacotes, métodos e herança.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2023-06-14',
    image: '/certificados/java.png',
    onlineUrl: null,
    displayOrder: 8
  },
  {
    title: 'Rocketseat Fundamentar',
    description: 'Curso de formação em fundamentos do desenvolvimento de software, abordando HTML, CSS, JavaScript, Node.js e SQL, além de estruturas de dados, paradigmas de programação, Git, GitHub e fundamentos do protocolo HTTP.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2023-03-15',
    image: '/certificados/fundamentar.png',
    onlineUrl: 'https://app.rocketseat.com.br/certificates/5186fdbe-b825-4bd2-bfb5-6d0b705a5d02',
    displayOrder: 9
  },
  {
    title: 'Node.js Express Project - CMS and Shopping Cart with Paypal',
    description: 'Curso completo de Node.js e Express, abordando desde a criação de APIs RESTful até a implementação de um sistema de gerenciamento de conteúdo (CMS) e um carrinho de compras com integração ao Paypal.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2023-03-15',
    image: '/certificados/node-express.png',
    onlineUrl: 'https://www.udemy.com/certificate/UC-43573517-241d-4af2-bce4-47c542200010/',
    displayOrder: 10
  },
  {
    title: 'Rocketseat Especializar',
    description: 'Curso focado no desenvolvimento web moderno, abordando JavaScript assíncrono, consumo de APIs, fundamentos de React.js e TypeScript, além de SQL avançado, colaboração com GitHub e criação de interfaces com animações em CSS.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2022-11-14',
    image: '/certificados/especializar.png',
    onlineUrl: 'https://app.rocketseat.com.br/certificates/0bc72566-f2ce-49e7-b1f7-10721b110f34',
    displayOrder: 11
  },
  {
    title: 'Curso Vue JS 2 - O Guia Completo (Vue Router & Vuex)',
    description: 'Curso completo de Vue.js 2, abordando desde os fundamentos do framework até a criação de aplicações web complexas com Vue Router e Vuex, incluindo práticas recomendadas e padrões de desenvolvimento.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2022-09-18',
    image: '/certificados/vuejs.png',
    onlineUrl: 'https://www.udemy.com/certificate/UC-00518eeb-840f-4e62-abe2-c784e4a92ec1/',
    displayOrder: 12
  },
  {
    title: 'Curso Completo do Desenvolvedor NodeJS e MongoDB',
    description: 'Curso completo de Node.js e MongoDB, abordando desde os fundamentos do desenvolvimento backend até a criação de APIs RESTful e integração com bancos de dados NoSQL.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2019-02-12',
    image: '/certificados/nodejs-mongo.png',
    onlineUrl: 'https://www.udemy.com/certificate/UC-WNHY1DVR/',
    displayOrder: 13
  },
  {
    title: 'IFTechDay - Interfaces Web Responsivas',
    description: 'Minicurso sobre desenvolvimento de interfaces web responsivas, abordando técnicas e conceitos para criação de páginas adaptáveis a diferentes tamanhos de tela e dispositivos.',
    category: 'GESTAO_DE_PROJETOS',
    completedAt: '2013-09-06',
    image: '/certificados/professor.png',
    onlineUrl: null,
    displayOrder: 14
  },
  {
    title: 'IFTechDay - Coordenador Campus Brasília',
    description: 'Atuação na coordenação do IFTechDay no Campus Brasília, contribuindo para a organização e realização do evento, voltado à disseminação de conhecimento e à troca de experiências em tecnologia.',
    category: 'GESTAO_DE_PROJETOS',
    completedAt: '2013-09-06',
    image: '/certificados/coordenador.png',
    onlineUrl: null,
    displayOrder: 15
  },
  {
    title: 'Java para desenvolvimento Web',
    description: 'Curso de formação em Java para desenvolvimento Web, abordando a criação de aplicações, integração com bancos de dados e fundamentos do ecossistema Java para Web.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2011-03-26',
    image: '/certificados/java-web.png',
    onlineUrl: null,
    displayOrder: 16
  },
  {
    title: 'Gerência de Projetos PMBOK',
    description: 'Curso de formação em gerenciamento de projetos, abordando as melhores práticas e diretrizes do PMBOK, incluindo planejamento, execução e controle de projetos.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2011-02-24',
    image: '/certificados/gerencia-de-projetos.png',
    onlineUrl: null,
    displayOrder: 17
  },
  {
    title: 'Java Orientado a Objetos',
    description: 'Curso de formação em Java, abordando os fundamentos da Programação Orientada a Objetos (POO), incluindo classes, objetos, herança e polimorfismo.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2010-12-30',
    image: '/certificados/java-oo.png',
    onlineUrl: null,
    displayOrder: 18
  },
  {
    title: 'Java com Testes. XML e Design Patterns',
    description: 'Curso de formação em Java, abordando desenvolvimento de aplicações, testes, manipulação de XML e aplicação de Design Patterns.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2010-12-04',
    image: '/certificados/java-testes.png',
    onlineUrl: null,
    displayOrder: 19
  },
  {
    title: 'Web Developer',
    description: 'Curso de formação em desenvolvimento web pelo SENAI, abordando os fundamentos para criação de aplicações e páginas web, com foco em programação, estruturação de interfaces e principais tecnologias utilizadas no desenvolvimento para a web.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2008-05-26',
    image: '/certificados/web-developer.png',
    onlineUrl: null,
    displayOrder: 20
  },
  {
    title: 'Designer Gráfico Aplicativos e Projetos',
    description: 'Curso de formação em design gráfico, abordando os fundamentos para criação de interfaces e experiências visuais em aplicações e projetos digitais.',
    category: 'DESENVOLVIMENTO_WEB',
    completedAt: '2005-06-07',
    image: '/certificados/designer-grafico.png',
    onlineUrl: null,
    displayOrder: 21
  }
]

async function seedCertificates() {
  for (const certificate of certificateCatalog) {
    const existing = await db.query.certificates.findFirst({
      where: (c, { eq }) => eq(c.title, certificate.title)
    })
    if (existing) {
      await db.update(certificates).set(certificate).where(eq(certificates.id, existing.id))
    } else {
      await db.insert(certificates).values(certificate)
    }
  }
}

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

  await seedCertificates()

  // Contas de teste com senha fixa e conhecida — só em dev. Em produção
  // (NODE_ENV=production) ficam de fora por padrão; force com
  // SEED_DEMO_ACCOUNTS=true se precisar delas lá mesmo assim.
  if (process.env.NODE_ENV !== 'production' || process.env.SEED_DEMO_ACCOUNTS === 'true') {
    await seedUsers()
  }
  await promoteOwnerToAdmin()

  console.log('Seed concluído: technologies, categories, tags, projeto de exemplo, certificados e usuários.')
  await db.$client.end()
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
