<script setup lang="ts">
import type { Project } from '#shared/types/project'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Projetos',
  description: 'Trabalhos, sistemas e experiências desenvolvidas.',
  ogTitle: 'Projetos',
  ogUrl: `${requestUrl.origin}/projetos`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/projetos` }] })

const QUERY = `
  query PublicProjects {
    projects {
      id title slug shortDescription coverImage featured isOnline startDate endDate
    }
  }
`

const { data, pending, error } = await useAsyncData('projetos', () =>
  useGraphQL<{ projects: Project[] }>(QUERY)
)

// Duas colunas independentes (par/ímpar) em vez de CSS columns: preserva a
// ordem de leitura esquerda-para-direita (1 2 / 3 4 / 5 6) enquanto cada
// coluna ainda se ajusta à própria altura, sem esperar a coluna vizinha.
const leftColumn = computed(() => (data.value?.projects ?? []).filter((_, index) => index % 2 === 0))
const rightColumn = computed(() => (data.value?.projects ?? []).filter((_, index) => index % 2 === 1))
</script>

<template>
  <div class="flex flex-col gap-3 md:px-6 py-12 md:mx-auto md:w-3xl md:py-17">
    <div class="mb-4 flex flex-col">
      <h1 class="text-2xl font-semibold">
        Projetos <span v-if="data?.projects.length" class="text-sm">( {{ data.projects.length }} )</span>
      </h1>
      <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground mt-1">
        Alguns dos projetos, sistemas e funcionalidades que desenvolvi ou ajudei a desenvolver. Alguns, com menos
        detalhes, por questões de confidencialidade do produto.
      </p>
    </div>

    <LoadingState v-if="pending" />
    <ErrorState v-else-if="error" message="Não foi possível carregar os projetos." />
    <template v-else>
      <EmptyState v-if="!data?.projects.length" message="Nenhum projeto encontrado." />

      <template v-else>
        <!-- Mobile: uma coluna só, ordem sequencial normal. -->
        <div class="flex flex-col gap-6 sm:hidden">
          <ProjectCard v-for="project in data.projects" :key="project.id" :project="project" />
        </div>

        <!-- sm+: duas colunas, cada uma com seu próprio fluxo vertical. -->
        <div class="hidden gap-6 sm:grid sm:grid-cols-2">
          <div class="flex flex-col gap-6">
            <ProjectCard v-for="project in leftColumn" :key="project.id" :project="project" />
          </div>
          <div class="flex flex-col gap-6">
            <ProjectCard v-for="project in rightColumn" :key="project.id" :project="project" />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
