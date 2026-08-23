<script setup lang="ts">
import type { Post } from '#shared/types/post'
import type { Project } from '#shared/types/project'
import TechMarquee from '@/components/common/TechMarquee.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Code2Icon, CoffeeIcon } from '@lucide/vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Início',
  description: 'Projetos, artigos e experiências construídos com Nuxt, GraphQL e PostgreSQL.',
  ogTitle: 'Portfolio CMS',
  ogUrl: requestUrl.origin
})
useHead({ link: [{ rel: 'canonical', href: requestUrl.origin }] })

const { data: projectsData } = await useAsyncData('home-featured-projects', () =>
  useGraphQL<{ featuredProjects: Project[] }>(`
    query FeaturedProjects {
      featuredProjects {
        id title slug shortDescription coverImage
        technologies { id name slug }
      }
    }
  `)
)

const { data: postsData } = await useAsyncData('home-latest-posts', () =>
  useGraphQL<{ posts: Post[] }>(`
    query LatestPosts {
      posts {
        id title slug excerpt publishedAt
      }
    }
  `)
)

const latestPosts = computed(() => (postsData.value?.posts ?? []).slice(0, 3))

function formatDate(value: string | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

// A barra de ícones navega por hash (`/#secao`) — só a seção correspondente
// fica visível por vez, em vez da página rolar por todas elas.
const route = useRoute()
const activeSection = computed(() => (route.hash ? route.hash.slice(1) : 'inicio'))
</script>

<template>
  <div class="flex flex-col gap-24">
    <section v-if="activeSection === 'inicio'" id="inicio"
      class="flex h-dvh flex-col items-center justify-center gap-4 text-center">
      <div class="relative">
        <div class="relative h-32 w-32 overflow-hidden rounded-full ring-3 ring-[#0d9373]">
          <img src="https://avatars.githubusercontent.com/u/12748346?v=4" alt="michel shintaku">
        </div>
        <div
          class="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-white ring-1 ring-[#999999]">
          <Code2Icon class="size-3.5 text-muted-foreground" />
        </div>
      </div>
      <p class="max-w-xl text-muted-foreground">
        こんにちは世界! Meu nome é Michel Shintaku
      </p>
      <h1 class="text-3xl font-semibold">
        Desenvolvedor Fullstack
      </h1>
      <p class="max-w-xl text-muted-foreground">
        MISSÃO: Desenvolver produtos digitais inovadores que integrem tecnologia, estratégia e experiência humana
        verdadeira.
      </p>

      <TechMarquee class="max-w-xl" />
    </section>

    <section v-if="activeSection === 'perfil'" id="perfil" class="scroll-mt-8">
      <h1 class="mb-4 text-2xl font-semibold">
        Perfil
      </h1>
      <p class="text-muted-foreground">
        Em construção.
      </p>
    </section>

    <section v-if="activeSection === 'valores'" id="valores" class="scroll-mt-8">
      <h1 class="mb-4 text-2xl font-semibold">
        Valores
      </h1>
      <p class="text-muted-foreground">
        Em construção.
      </p>
    </section>

    <section v-if="activeSection === 'formacao'" id="formacao" class="scroll-mt-8">
      <h1 class="mb-4 text-2xl font-semibold">
        Formação
      </h1>
      <p class="text-muted-foreground">
        Em construção.
      </p>
    </section>

    <section v-if="activeSection === 'cursos'" id="cursos" class="scroll-mt-8">
      <h1 class="mb-4 text-2xl font-semibold">
        Cursos
      </h1>
      <p class="text-muted-foreground">
        Em construção.
      </p>
    </section>

    <section v-if="activeSection === 'experiencia'" id="experiencia" class="scroll-mt-8">
      <h1 class="mb-4 text-2xl font-semibold">
        Experiência
      </h1>
      <p class="text-muted-foreground">
        Em construção.
      </p>
    </section>

    <section v-if="activeSection === 'projetos'" id="projetos" class="scroll-mt-8">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-semibold">
          Projetos em destaque
        </h1>
        <NuxtLink to="/projetos" class="text-sm text-muted-foreground hover:underline">
          Ver todos
        </NuxtLink>
      </div>

      <div v-if="projectsData?.featuredProjects.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="project in projectsData.featuredProjects" :key="project.id" :to="`/projetos/${project.slug}`"
          class="flex flex-col gap-3 rounded-lg border p-5 transition-colors hover:bg-accent">
          <img v-if="project.coverImage" :src="project.coverImage" :alt="project.title"
            class="aspect-video w-full rounded-md object-cover">
          <h2 class="text-lg font-medium">
            {{ project.title }}
          </h2>
          <p class="text-sm text-muted-foreground">
            {{ project.shortDescription }}
          </p>
          <div v-if="project.technologies.length" class="flex flex-wrap gap-1">
            <Badge v-for="tech in project.technologies" :key="tech.id" variant="outline">
              {{ tech.name }}
            </Badge>
          </div>
        </NuxtLink>
      </div>
      <p v-else class="text-muted-foreground">
        Nenhum projeto em destaque no momento.
      </p>
    </section>

    <section v-if="activeSection === 'blog'" id="blog" class="scroll-mt-8">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-semibold">
          Blog
        </h1>
        <NuxtLink to="/posts" class="text-sm text-muted-foreground hover:underline">
          Ver todos
        </NuxtLink>
      </div>

      <div v-if="latestPosts.length" class="flex flex-col gap-4">
        <NuxtLink v-for="post in latestPosts" :key="post.id" :to="`/posts/${post.slug}`"
          class="flex flex-col gap-1 rounded-lg border p-5 transition-colors hover:bg-accent">
          <span v-if="post.publishedAt" class="text-xs text-muted-foreground">{{ formatDate(post.publishedAt) }}</span>
          <h2 class="text-lg font-medium">
            {{ post.title }}
          </h2>
          <p class="text-sm text-muted-foreground">
            {{ post.excerpt }}
          </p>
        </NuxtLink>
      </div>
      <p v-else class="text-muted-foreground">
        Nenhum post publicado ainda.
      </p>
    </section>

    <section v-if="activeSection === 'contato'" id="contato" class="scroll-mt-8">
      <h1 class="mb-4 text-2xl font-semibold">
        Contato
      </h1>
      <p class="text-muted-foreground">
        Em construção.
      </p>
    </section>

    <section v-if="activeSection === 'pagar-um-cafe'" id="pagar-um-cafe" class="scroll-mt-8 pb-24">
      <div class="flex flex-col items-start gap-4 rounded-lg border p-8">
        <CoffeeIcon class="size-8 text-muted-foreground" />
        <h1 class="text-2xl font-semibold">
          Pagar um café
        </h1>
        <p class="max-w-2xl text-muted-foreground">
          Tem um problema técnico ou uma dúvida de arquitetura e quer trocar uma ideia? Descreva o que você precisa
          e a gente marca um café (virtual) para conversar sobre o diagnóstico e possíveis formas de resolver.
        </p>
        <NuxtLink to="/pagar-um-cafe">
          <Button>Pagar um café</Button>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
