<script setup lang="ts">
import type { Post } from '#shared/types/post'
import type { Project } from '#shared/types/project'
import { formatPeriod } from '#shared/utils/format-period'
import homeBg from '@/assets/img/bg-home-02.png'
import michelDark from '@/assets/img/michel-dark.png'
import michelLight from '@/assets/img/michel-light.png'
import TechMarquee from '@/components/common/TechMarquee.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Code2Icon, FolderGit2Icon, MailIcon, MoveRight } from '@lucide/vue'

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
        id title slug shortDescription coverImage isOnline startDate endDate
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

// A barra de ícones navega por hash (`/#secao`) para as seções que continuam
// aqui (destaque de projetos/blog) — só a seção correspondente fica visível
// por vez, com uma transição suave (fade).
//
// O hash da URL nunca chega ao servidor (é só do navegador) — então o SSR
// sempre renderiza "início", não importa qual seção a URL pedia. Usar
// route.hash direto faria o primeiro render do cliente divergir do HTML do
// servidor bem no meio da hidratação, quebrando a reconciliação.
//
// A pegadinha: isso só é um risco de fato DURANTE a hidratação inicial (a
// única vez em que existe HTML de servidor pra reconciliar). Numa navegação
// client-side pra cá vindo de outra página (ex: voltar de /projetos), não há
// hidratação nenhuma acontecendo — é só uma montagem normal do Vue, e usar a
// hash real desde o primeiro render não tem risco de mismatch. Por isso o
// "fingir início" só se aplica durante nuxtApp.isHydrating; fora disso,
// activeSection já nasce correto, sem o flash de "início" a cada volta pra
// esta página.
const nuxtApp = useNuxtApp()
const mounted = ref(import.meta.client && !nuxtApp.isHydrating)
onMounted(() => {
  mounted.value = true
})

const route = useRoute()
const activeSection = computed(() => {
  if (!mounted.value) return 'inicio'
  return route.hash ? route.hash.slice(1) : 'inicio'
})

// Avatar troca de foto junto com o tema global (claro/escuro).
const { theme } = useTheme()
const avatarSrc = computed(() => (theme.value === 'dark' ? michelDark : michelLight))
</script>

<template>
  <div class="flex flex-col gap-24">
    <Transition name="section-fade" mode="out-in">
      <section v-if="activeSection === 'inicio'" id="inicio" key="inicio"
        class="relative min-h-screen bg-cover bg-center bg-no-repeat lg:h-dvh lg:min-h-0 lg:overflow-hidden"
        :style="{ backgroundImage: `url(${homeBg})` }">
        <!-- Scrim sobre a foto de fundo para garantir contraste do texto. -->
        <div class="absolute inset-0 bg-background/75" aria-hidden="true">
          <div
            class="relative flex min-h-dvh w-full flex-col-reverse items-center justify-center gap-10 px-6 py-16 text-center lg:flex-row lg:gap-24 lg:px-8 lg:py-0 lg:text-start">
            <div class="flex w-full min-w-0 max-w-2xl flex-col items-center lg:w-auto lg:items-start">
              <p class="text-lg font-light text-foreground/70 sm:text-xl">
                こんにちは世界！私は
              </p>
              <h1 class="mt-2 text-4xl font-semibold sm:text-5xl lg:text-6xl">
                Michel Shintaku
              </h1>
              <p class="mt-2 text-2xl font-semibold sm:text-3xl lg:text-4xl">
                Full Stack Developer
              </p>

              <p class="mt-4 font-light text-foreground/70">
                Crio produtos digitais que unem tecnologia e estratégia, com foco no usuário,
                <br class="hidden sm:inline">transformando necessidades reais em soluções inovadoras.
              </p>

              <div class="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button as-child size="lg">
                  <NuxtLink to="/#projetos">
                    <FolderGit2Icon />
                    Veja meu trabalho
                  </NuxtLink>
                </Button>
                <Button as-child size="lg" variant="outline">
                  <NuxtLink to="/contato">
                    <MailIcon />
                    Fale comigo
                  </NuxtLink>
                </Button>
              </div>

              <TechMarquee class="mt-4 w-full max-w-xl" />
            </div>

            <div class="relative shrink-0">
              <img :src="avatarSrc" alt="Michel Shintaku"
                class="h-40 w-40 rounded-full object-cover ring-3 ring-[#aaaaaa] sm:h-52 sm:w-52 lg:h-60 lg:w-60">
              <div
                class="absolute -right-1 -bottom-1 flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-[#999999] lg:h-16 lg:w-16">
                <Code2Icon class="size-6 text-muted-foreground lg:size-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'projetos'" id="projetos" key="projetos"
        class="min-h-screen scroll-mt-8 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
        <div class="flex flex-col items-center justify-center gap-4 text-left">
          <div class="md:h-full">
            <div class="px-6 py-6 md:py-14 md:mx-auto md:w-3xl">
              <NuxtLink to="/projetos"
                class="mb-6 text-sm text-muted-foreground hover:underline flex items-center justify-end gap-2">
                Ver todos
                <MoveRight class="h-4 w-4" />
              </NuxtLink>

              <div class="mb-6 flex flex-col gap-3">
                <h1 class="text-2xl font-semibold">
                  Projetos destaque
                </h1>

                <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground">
                  Aplicações interessantes e que gostei de desenvolver
                </p>
              </div>

              <div v-if="projectsData?.featuredProjects.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                <NuxtLink v-for="project in projectsData.featuredProjects" :key="project.id"
                  :to="`/projetos/${project.slug}`"
                  class="flex flex-col gap-3 rounded-sm border p-5 transition-colors hover:bg-accent">
                  <img v-if="project.coverImage" :src="project.coverImage" :alt="project.title"
                    class="aspect-video w-full rounded-sm object-cover">
                  <h2 class="text-lg font-medium">
                    {{ project.title }}
                  </h2>
                  <p class="text-sm text-muted-foreground min-h-20">
                    {{ project.shortDescription }}
                  </p>
                  <Separator />
                  <div class="flex items-center justify-between gap-2">
                    <Badge :variant="project.isOnline ? 'default' : 'secondary'">
                      {{ project.isOnline ? 'Online' : 'Offline' }}
                    </Badge>
                    <span v-if="formatPeriod(project.startDate, project.endDate)" class="text-xs text-muted-foreground">
                      {{ formatPeriod(project.startDate, project.endDate) }}
                    </span>
                  </div>
                </NuxtLink>
              </div>
              <p v-else class="text-muted-foreground">
                Nenhum projeto em destaque no momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'blog'" id="blog" key="blog"
        class="min-h-screen scroll-mt-8 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
        <div class="flex flex-col items-center justify-center gap-4 text-left">
          <div class="md:h-full">
            <div class="px-6 py-12 md:py-24 md:mx-auto md:w-3xl">
              <div class="mb-6 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 class="text-2xl font-semibold">
                    Blog destaque
                  </h1>

                  <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground mt-2">
                    Tecnologia e desenvolvimento de software
                  </p>
                </div>

                <NuxtLink to="/posts" class="text-sm text-muted-foreground hover:underline hover:text-white">
                  Ver todos
                </NuxtLink>
              </div>

              <div v-if="latestPosts.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                <NuxtLink v-for="post in latestPosts" :key="post.id" :to="`/posts/${post.slug}`"
                  class="flex flex-col gap-1 rounded-sm border p-5 transition-colors hover:bg-accent">
                  <span v-if="post.publishedAt" class="text-xs text-muted-foreground">{{ formatDate(post.publishedAt)
                    }}</span>
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
            </div>
          </div>
        </div>
      </section>

    </Transition>
  </div>
</template>

<style scoped>
.section-fade-enter-active,
.section-fade-leave-active {
  transition: opacity 0.2s ease;
}

.section-fade-enter-from,
.section-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {

  .section-fade-enter-active,
  .section-fade-leave-active {
    transition: none;
  }
}
</style>
