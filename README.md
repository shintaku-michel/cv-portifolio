# Portfolio CMS

Aplicação full-stack de portfólio pessoal (monólito modular). Stack, arquitetura e regras de desenvolvimento estão documentadas em [`CLAUDE.md`](./CLAUDE.md).

## Stack

- Nuxt 4 + Vue 3 + TypeScript
- Tailwind CSS v4 + shadcn-vue (reka-ui)
- Nitro + GraphQL + Service Layer
- PostgreSQL + Drizzle ORM
- Vitest + Playwright

## Setup

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Aplicação disponível em `http://localhost:3000`.

## Qualidade

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Status

Roadmap por fases descrito na seção 41 de `CLAUDE.md`. Fase atual: **M1 — Foundation**.
