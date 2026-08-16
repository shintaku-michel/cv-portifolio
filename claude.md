# Portfolio CMS

## 1. Objetivo

Construir uma aplicação full-stack para portfólio pessoal de desenvolvedor.

A aplicação terá:

- página inicial do portfólio;
- apresentação profissional;
- cadastro e exibição de projetos;
- blog/posts;
- autenticação de usuários;
- usuários com diferentes níveis de permissão;
- painel administrativo;
- gerenciamento de projetos;
- gerenciamento de posts;
- moderação de comentários;
- likes;
- compartilhamento;
- categorias;
- tags;
- tecnologias;
- SEO;
- acessibilidade;
- testes;
- documentação técnica.

O projeto deve ser desenvolvido como um **monólito modular**, evitando microserviços e complexidade desnecessária.

---

# 2. Stack

## Frontend

- Nuxt 4
- Vue 3
- TypeScript
- Tailwind CSS
- shadcn-vue

## Backend

- Nuxt Server / Nitro
- GraphQL
- Service Layer

## Banco de dados

- PostgreSQL
- Drizzle ORM
- Drizzle Migrations

## Qualidade

- TypeScript strict
- ESLint
- Vitest
- testes de integração
- testes E2E quando necessário

## Infraestrutura

- Git
- GitHub
- CI/CD
- ambiente de desenvolvimento
- ambiente de produção

---

# 3. Princípios arquiteturais

A arquitetura deve seguir:

Nuxt
  ↓
GraphQL
  ↓
Resolvers
  ↓
Services
  ↓
Drizzle ORM
  ↓
PostgreSQL

## Regras

- Componentes Vue não devem acessar o banco diretamente.
- Componentes Vue não devem conter regras de negócio complexas.
- Resolvers GraphQL não devem conter regras de negócio complexas.
- Regras de negócio devem ficar na camada de services.
- Acesso ao banco deve ficar isolado através do Drizzle.
- Autorização deve ser validada no servidor.
- Nunca confiar em permissões enviadas pelo cliente.
- Middleware do frontend não deve ser considerado mecanismo de segurança.
- Toda operação protegida deve validar autenticação e autorização no servidor.
- Não expor secrets ao cliente.
- Não armazenar senhas em texto puro.
- Não usar `any` sem justificativa técnica.
- Não instalar dependências sem necessidade.
- Não criar abstrações prematuramente.
- Preferir componentes pequenos, reutilizáveis e coesos.
- Evitar duplicação de lógica.
- Não alterar decisões arquiteturais importantes sem explicar o motivo.

---

# 4. Conceito de domínio

O sistema possui dois tipos principais de conteúdo:

## Projetos

Representam trabalhos, sistemas, aplicações, produtos ou experiências desenvolvidas pelo proprietário do portfólio.

Exemplos:

- Sistema web;
- Aplicação SaaS;
- Dashboard administrativo;
- Design System;
- Projeto open source;
- Aplicação mobile;
- Sistema institucional.

Projetos pertencem ao **portfólio profissional**.

## Posts

Representam conteúdo editorial publicado no blog.

Exemplos:

- Artigos técnicos;
- Tutoriais;
- Estudos;
- Relatos de projetos;
- Conteúdo sobre Vue/Nuxt;
- Design systems;
- Acessibilidade;
- Desenvolvimento frontend;
- Backend.

Posts pertencem ao **blog**.

Projetos e posts são entidades diferentes e não devem ser misturados.

---

# 5. Usuários

Existirão inicialmente dois papéis:

USER
ADMIN

## Visitor

Usuário não autenticado.

Pode:

- visualizar o portfólio;
- visualizar projetos publicados;
- visualizar posts publicados;
- visualizar comentários aprovados;
- compartilhar posts.

Não pode:

- curtir;
- comentar;
- acessar o painel administrativo.

## USER

Usuário autenticado.

Pode:

- visualizar conteúdo;
- curtir posts;
- remover likes;
- comentar;
- visualizar seus comentários;
- excluir seus próprios comentários, quando permitido;
- gerenciar dados permitidos do próprio perfil.

## ADMIN

Usuário administrativo.

Pode:

- acessar o painel administrativo;
- criar projetos;
- editar projetos;
- excluir projetos;
- publicar projetos;
- despublicar projetos;
- criar posts;
- editar posts;
- excluir posts;
- publicar posts;
- despublicar posts;
- moderar comentários;
- aprovar comentários;
- ocultar comentários;
- gerenciar usuários.

---

# 6. Projetos

Projetos são uma funcionalidade central do portfólio.

O Admin deverá conseguir cadastrar e gerenciar projetos pelo painel administrativo.

## Funcionalidades

O Admin deve poder:

- criar projeto;
- editar projeto;
- excluir projeto;
- salvar projeto como rascunho;
- publicar projeto;
- despublicar projeto;
- definir projeto como destaque;
- definir ordem de exibição;
- adicionar tecnologias;
- adicionar imagem de capa;
- adicionar imagens adicionais;
- informar URL de demonstração;
- informar URL do repositório;
- adicionar descrição;
- adicionar conteúdo detalhado;
- adicionar período/data do projeto.

---

# 7. Dados de um projeto

Um projeto deverá possuir, no mínimo:

Project
├── id
├── title
├── slug
├── shortDescription
├── description
├── coverImage
├── status
├── featured
├── displayOrder
├── demoUrl
├── repositoryUrl
├── startDate
├── endDate
├── createdAt
└── updatedAt

Tecnologias utilizadas devem ser modeladas separadamente ou através de relacionamento apropriado.

Possível estrutura:

Project
   │
   └──< ProjectTechnology >── Technology

Isso permitirá reutilizar tecnologias entre projetos.

Exemplos de tecnologias:

- Vue
- Nuxt
- TypeScript
- JavaScript
- GraphQL
- PostgreSQL
- Drizzle
- Tailwind CSS
- Docker

---

# 8. Status dos projetos

Projetos possuem um workflow simples:

DRAFT
PUBLISHED

Fluxo:

DRAFT
  │
  ▼
PUBLISHED
  │
  ▼
DRAFT

Não existe etapa de aprovação administrativa para publicação de projetos.

O Admin pode publicar e despublicar projetos diretamente.

Projetos em `DRAFT` nunca devem aparecer publicamente.

---

# 9. Projeto em destaque

Um projeto pode ser marcado como:

featured = true

Projetos em destaque poderão aparecer na página inicial.

Deve existir uma forma de controlar a ordem de exibição:

displayOrder

Exemplo:

1 → Projeto principal
2 → Projeto secundário
3 → Outro projeto

A regra de ordenação deve ser definida em um único local e não duplicada nos componentes.

---

# 10. Páginas públicas de projetos

Criar:

/projetos

e:

/projetos/[slug]

A página de listagem deverá permitir:

- visualizar projetos publicados;
- destacar projetos principais;
- filtrar por tecnologia, se necessário;
- ordenar projetos.

A página individual deverá apresentar:

- título;
- descrição curta;
- descrição completa;
- imagem de capa;
- galeria, se existir;
- tecnologias;
- links;
- período;
- informações relevantes;
- projeto relacionado, quando aplicável.

Projetos em `DRAFT` nunca devem aparecer publicamente.

---

# 11. Administração de projetos

Criar:

/admin/projetos
/admin/projetos/novo
/admin/projetos/[id]/editar

A listagem administrativa deverá apresentar:

- Título
- Status
- Destaque
- Tecnologias
- Data
- Ações

Ações:

- Editar
- Visualizar
- Publicar
- Despublicar
- Excluir

O formulário de projeto deverá permitir:

- Título
- Slug
- Descrição curta
- Descrição completa
- Imagem de capa
- Galeria
- Tecnologias
- URL da demonstração
- URL do repositório
- Data inicial
- Data final
- Destaque
- Ordem de exibição
- Status

---

# 12. Posts

Posts são conteúdos editoriais.

Estrutura inicial:

Post
├── id
├── title
├── slug
├── excerpt
├── content
├── coverImage
├── status
├── authorId
├── categoryId
├── publishedAt
├── createdAt
└── updatedAt

---

# 13. Workflow dos posts

Posts possuem o mesmo workflow dos projetos:

DRAFT
PUBLISHED

Fluxo:

DRAFT
  │
  ▼
PUBLISHED
  │
  ▼
DRAFT

Não existe etapa de aprovação administrativa para publicação de posts.

O Admin pode:

- criar post;
- editar post;
- salvar como rascunho;
- publicar;
- despublicar;
- excluir.

Somente posts com:

status = PUBLISHED

podem aparecer publicamente.

Posts em `DRAFT` nunca devem aparecer publicamente.

---

# 14. Categorias e tags

Posts devem suportar categorias e tags.

Categorias representam uma classificação principal do post.

Exemplos:

- Vue
- Nuxt
- TypeScript
- Frontend
- Backend
- Acessibilidade
- Design Systems
- JavaScript

Tags permitem múltiplos valores por post.

Estrutura:

Post
  │
  └──< PostTag >── Tag

Um post pode possuir uma categoria e múltiplas tags.

---

# 15. Comentários

Usuários autenticados podem criar comentários em posts publicados.

Todo novo comentário deve começar como:

PENDING

Comentários não aparecem publicamente imediatamente após serem criados.

O Admin deve moderar cada comentário antes de sua publicação.

## Status

PENDING
VISIBLE
HIDDEN

Fluxo:

PENDING
  │
  ├──────────────► HIDDEN
  │
  ▼
VISIBLE

## Admin

O Admin pode:

- visualizar comentários pendentes;
- aprovar comentários;
- ocultar comentários;
- excluir comentários;
- visualizar comentários publicados;
- visualizar comentários ocultos.

## Usuário

O usuário pode:

- criar comentários;
- visualizar comentários aprovados;
- excluir seus próprios comentários, quando permitido.

Comentários com status `PENDING` ou `HIDDEN` nunca devem ser exibidos publicamente.

O frontend nunca deve conseguir alterar diretamente o status de um comentário para `VISIBLE`.

A alteração para `VISIBLE` deve ocorrer exclusivamente através de uma operação autorizada no servidor para usuários com role `ADMIN`.

---

# 16. Respostas aos comentários

O sistema deve ser preparado para suportar respostas aos comentários.

Estrutura:

Comment
├── id
├── content
├── userId
├── postId
├── parentId
├── status
├── createdAt
└── updatedAt

`parentId` deve permitir identificar o comentário pai.

A implementação inicial pode limitar a profundidade das respostas a um nível.

Não implementar sistemas complexos de threads sem necessidade.

---

# 17. Likes

Usuários autenticados podem curtir posts.

Estrutura:

Like
├── id
├── userId
├── postId
└── createdAt

Deve existir uma restrição única:

(userId, postId)

Um usuário não pode curtir o mesmo post mais de uma vez.

A funcionalidade deverá permitir:

LIKE
UNLIKE

O resultado da operação deverá informar:

- se o usuário curtiu;
- quantidade total de likes.

---

# 18. Compartilhamento

Posts devem possuir ação de compartilhamento.

Preferência:

1. Web Share API quando disponível;
2. fallback para copiar URL.

Também devem ser implementados metadados para compartilhamento:

- og:title
- og:description
- og:image
- og:url

---

# 19. Autenticação

A autenticação deve utilizar sessões seguras.

Fluxo:

Login
  ↓
Validar credenciais
  ↓
Verificar senha
  ↓
Criar sessão
  ↓
Cookie HttpOnly

Nunca:

- armazenar senha em texto puro;
- enviar senha para o cliente após autenticação;
- confiar em `role` fornecido pelo frontend;
- armazenar secrets no código;
- expor cookies de sessão ao JavaScript quando não necessário.

---

# 20. Autorização

Existem dois níveis:

## Frontend

Middleware pode impedir navegação para áreas protegidas.

## Backend

Toda operação protegida deve validar:

autenticado?
     ↓
role suficiente?
     ↓
operação permitida?

A proteção no frontend nunca deve ser considerada suficiente.

---

# 21. GraphQL

GraphQL será a API principal da aplicação.

Deve possuir:

- Queries
- Mutations
- Types
- Inputs
- Enums

O schema deverá ser organizado por domínio:

server/graphql/
├── schema/
│   ├── user.graphql
│   ├── project.graphql
│   ├── post.graphql
│   ├── comment.graphql
│   ├── category.graphql
│   └── technology.graphql
│
├── resolvers/
│   ├── user.ts
│   ├── project.ts
│   ├── post.ts
│   ├── comment.ts
│   └── ...
│
└── context.ts

Resolvers devem delegar regras de negócio para services.

Exemplo:

GraphQL mutation
      ↓
Resolver
      ↓
ProjectService
      ↓
Drizzle
      ↓
PostgreSQL

---

# 22. GraphQL — Projetos

Deverão existir operações para:

- listar projetos publicados;
- buscar projeto por slug;
- buscar projeto por ID;
- listar projetos em destaque;
- criar projeto;
- editar projeto;
- publicar projeto;
- despublicar projeto;
- excluir projeto.

Queries conceituais:

projects
project(slug: String!)
featuredProjects

Mutations:

createProject
updateProject
publishProject
unpublishProject
deleteProject

Operações administrativas devem exigir `ADMIN`.

---

# 23. GraphQL — Posts

Queries:

posts
post(slug: String!)
featuredPosts

Mutations:

createPost
updatePost
publishPost
unpublishPost
deletePost

Ações administrativas devem exigir `ADMIN`.

Não criar mutations de aprovação de posts.

Não criar status `PENDING` para posts.

---

# 24. GraphQL — Comentários

Queries:

comments(postId: ID!)
pendingComments
comment(id: ID!)

Mutations:

createComment
approveComment
hideComment
deleteComment

Regras:

- `createComment` exige usuário autenticado;
- `approveComment` exige ADMIN;
- `hideComment` exige ADMIN;
- `deleteComment` deve validar autorização;
- comentários `PENDING` não podem ser retornados para usuários públicos;
- somente comentários `VISIBLE` podem ser retornados na página pública.

---

# 25. Service Layer

Criar services separados por domínio:

server/services/
├── auth.service.ts
├── user.service.ts
├── project.service.ts
├── post.service.ts
├── comment.service.ts
├── like.service.ts
├── category.service.ts
└── technology.service.ts

Os services devem conter regras de negócio.

Exemplo:

ProjectService
├── create
├── update
├── publish
├── unpublish
├── delete
├── getBySlug
└── getFeatured

PostService
├── create
├── update
├── publish
├── unpublish
├── delete
├── getBySlug
└── getPublished

CommentService
├── create
├── approve
├── hide
├── delete
├── getVisible
└── getPending

---

# 26. Banco de dados

Entidades iniciais:

users
sessions
projects
technologies
project_technologies
posts
categories
tags
post_tags
comments
likes

Relacionamentos principais:

User
 ├──< Post
 ├──< Comment
 └──< Like

Project
 └──< ProjectTechnology >── Technology

Post
 ├──< Comment
 ├──< Like
 ├──> Category
 └──< PostTag >── Tag

Comment
 └──> Comment
      através de parentId

---

# 27. Status do banco

## Projects

DRAFT
PUBLISHED

## Posts

DRAFT
PUBLISHED

## Comments

PENDING
VISIBLE
HIDDEN

Não criar status adicionais sem necessidade.

---

# 28. Estrutura do projeto

portfolio/
│
├── app/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── home/
│   │   ├── projects/
│   │   ├── posts/
│   │   ├── comments/
│   │   └── admin/
│   │
│   ├── composables/
│   ├── layouts/
│   ├── middleware/
│   ├── pages/
│   │   ├── index.vue
│   │   ├── projetos/
│   │   │   ├── index.vue
│   │   │   └── [slug].vue
│   │   ├── posts/
│   │   │   ├── index.vue
│   │   │   └── [slug].vue
│   │   ├── login.vue
│   │   └── admin/
│   │       ├── index.vue
│   │       ├── projetos/
│   │       ├── posts/
│   │       ├── comentarios.vue
│   │       └── usuarios.vue
│   │
│   └── app.vue
│
├── server/
│   ├── graphql/
│   ├── services/
│   ├── middleware/
│   └── utils/
│
├── shared/
│   └── types/
│
├── drizzle/
│   └── migrations/
│
├── tests/
│
├── public/
│
├── CLAUDE.md
├── drizzle.config.ts
├── nuxt.config.ts
├── package.json
└── README.md

---

# 29. UI e Design System

Utilizar shadcn-vue como base dos componentes.

Componentes esperados:

- Button
- Card
- Input
- Textarea
- Select
- Dialog
- DropdownMenu
- Badge
- Avatar
- Table
- Tabs
- Sheet
- Skeleton
- Alert
- Toast

Organizar componentes específicos do domínio:

components/
├── projects/
├── posts/
├── comments/
└── admin/

Não modificar componentes base sem necessidade.

Preferir composição sobre duplicação.

---

# 30. Estados da interface

Todas as funcionalidades devem considerar:

- loading;
- success;
- error;
- empty;
- disabled;
- pending.

Exemplo para comentários:

PENDING → interface administrativa de moderação.

VISIBLE → comentário público.

HIDDEN → não aparece publicamente.

---

# 31. SEO

Implementar SEO por página.

Posts e projetos devem possuir:

- title;
- description;
- canonical URL;
- Open Graph;
- Twitter metadata.

Slugs devem ser:

- únicos;
- estáveis;
- amigáveis para SEO.

Projetos e posts publicados devem possuir URLs públicas indexáveis.

Projetos e posts em `DRAFT` não devem ser indexados.

---

# 32. Acessibilidade

Toda interface deve considerar:

- navegação por teclado;
- focus states;
- contraste;
- labels;
- mensagens de erro;
- hierarquia de headings;
- semântica HTML;
- ARIA somente quando necessário;
- componentes acessíveis.

Não utilizar cor como único indicador de estado.

---

# 33. Testes

## Unitários

Testar:

- services;
- regras de negócio;
- validações;
- utilities.

## Integração

Testar:

- GraphQL;
- banco;
- autenticação;
- autorização;
- mutations administrativas;
- moderação de comentários.

## E2E

Fluxos prioritários:

### Projeto

Admin login
↓
Criar projeto
↓
Salvar como DRAFT
↓
Publicar projeto
↓
Projeto aparece publicamente

### Post

Admin login
↓
Criar post
↓
Salvar como DRAFT
↓
Publicar post
↓
Post aparece publicamente

### Comentário

User login
↓
Abrir post
↓
Criar comentário
↓
Comentário fica PENDING
↓
Comentário não aparece publicamente
↓
Admin aprova
↓
Comentário aparece publicamente

### Like

User login
↓
Abrir post
↓
Curtir
↓
Like aparece
↓
Descurtir
↓
Like desaparece

---

# 34. Segurança

Antes do deploy verificar:

- password hashing;
- session security;
- HttpOnly cookies;
- authorization server-side;
- input validation;
- content sanitization;
- rate limiting;
- CSRF protection quando aplicável;
- upload validation;
- secrets fora do Git;
- proteção das rotas administrativas;
- proteção das mutations administrativas.

Conteúdo fornecido por usuários nunca deve ser renderizado como HTML não sanitizado.

Especial atenção deve ser dada aos comentários.

---

# 35. Performance

Verificar:

- imagens otimizadas;
- lazy loading;
- paginação;
- queries eficientes;
- índices PostgreSQL;
- cache quando apropriado;
- GraphQL N+1;
- SSR;
- code splitting.

Não adicionar otimizações prematuramente.

Primeiro medir, depois otimizar.

---

# 36. Git

Utilizar commits pequenos e semânticos.

Exemplos:

feat: initialize nuxt application
feat: add database schema
feat: add authentication
feat: add graphql schema
feat: add project management
feat: add post management
feat: add comments
feat: add comment moderation
feat: add likes
feat: add admin dashboard
test: add project service tests
test: add comment moderation tests
fix: prevent duplicate likes

---

# 37. Critérios de qualidade

Toda feature deve:

1. ser implementada;
2. possuir validação adequada;
3. respeitar a arquitetura;
4. ter testes quando aplicável;
5. passar ESLint;
6. passar TypeScript;
7. passar testes;
8. passar build.

Executar:

npm run lint
npm run typecheck
npm run test
npm run build

antes de considerar uma feature concluída.

---

# 38. Processo de desenvolvimento com Claude

Claude deve trabalhar por fases.

Nunca implementar todo o projeto de uma vez.

Para cada tarefa:

1. analisar o contexto;
2. identificar arquivos que serão alterados;
3. explicar brevemente a abordagem;
4. implementar;
5. executar testes;
6. executar lint;
7. executar typecheck;
8. executar build quando apropriado;
9. corrigir problemas;
10. informar quais arquivos foram alterados.

Claude não deve avançar automaticamente para outra fase.

---

# 39. Regra para prompts

As tarefas devem possuir:

Objetivo
Contexto
Regras
Critérios de aceite
Limitações

Exemplo:

Objetivo:
Implementar criação de projetos.

Contexto:
O sistema utiliza Nuxt 4, GraphQL, Drizzle e PostgreSQL.

Regras:
Somente ADMIN pode criar projetos.
Projetos começam como DRAFT.
Slug deve ser único.

Critérios de aceite:
- mutation createProject;
- ProjectService;
- persistência;
- validação;
- testes;
- autorização.

Limitação:
Não implementar publicação ainda.

---

# 40. Regra de revisão

Após implementar uma feature, Claude poderá ser solicitado a fazer uma revisão separada.

Durante uma revisão, procurar:

- bugs;
- problemas de segurança;
- problemas de autorização;
- problemas de tipagem;
- N+1 queries;
- duplicação;
- problemas de arquitetura;
- código desnecessário;
- problemas de acessibilidade.

Não realizar refatorações cosméticas sem necessidade.

---

# 41. Roadmap

## M0 — Especificação

- requisitos;
- arquitetura;
- banco;
- GraphQL;
- autenticação;
- documentação.

## M1 — Foundation

- Nuxt 4;
- TypeScript;
- Tailwind;
- shadcn-vue;
- ESLint;
- Vitest;
- Git.

## M2 — Database

- PostgreSQL;
- Drizzle;
- schema;
- migrations;
- seed.

## M3 — Authentication

- users;
- sessions;
- login;
- logout;
- roles;
- authorization.

## M4 — GraphQL

- schema;
- context;
- resolvers;
- services;
- queries;
- mutations.

## M5 — Projects

- cadastro;
- edição;
- exclusão;
- tecnologias;
- imagens;
- rascunho;
- publicação;
- despublicação;
- destaque;
- ordenação;
- listagem pública;
- página individual.

## M6 — Posts

- cadastro;
- edição;
- exclusão;
- categorias;
- tags;
- editor;
- rascunho;
- publicação;
- despublicação;
- listagem pública;
- página individual.

## M7 — Admin

- dashboard;
- gerenciamento de projetos;
- gerenciamento de posts;
- moderação de comentários;
- usuários.

## M8 — Social

- likes;
- comentários;
- respostas;
- compartilhamento.

## M9 — UI/UX

- design system;
- responsive;
- acessibilidade;
- estados de loading;
- estados de erro;
- empty states.

## M10 — SEO

- metadata;
- Open Graph;
- sitemap;
- robots;
- URLs;
- structured data quando apropriado.

## M11 — Quality

- unit tests;
- integration tests;
- E2E;
- security review;
- performance review.

## M12 — Production

- CI/CD;
- environment variables;
- PostgreSQL production;
- deploy;
- domínio;
- monitoramento.

---

# 42. Regra principal

O objetivo não é simplesmente fazer a aplicação funcionar.

O objetivo é construir um projeto que demonstre conhecimento prático de:

- Vue;
- Nuxt;
- TypeScript;
- GraphQL;
- PostgreSQL;
- Drizzle ORM;
- autenticação;
- autorização;
- arquitetura;
- Design System;
- acessibilidade;
- SEO;
- testes;
- segurança;
- DevOps.

As decisões técnicas devem ser justificáveis e documentadas.

Não adicionar tecnologia apenas para aumentar a quantidade de tecnologias utilizadas.

A aplicação deve priorizar simplicidade, manutenibilidade, segurança e clareza arquitetural.