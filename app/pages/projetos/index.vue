<script setup lang="ts">
import type { Project } from '#shared/types/project'
import { formatPeriod } from '#shared/utils/format-period'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

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
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-12 md:mx-auto md:w-3xl md:py-17">
    <div class="mb-4 flex flex-col">
      <h1 class="text-2xl font-semibold">
        Projetos
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

      <div v-else class="gap-6 sm:columns-2">
        <NuxtLink v-for="project in data.projects" :key="project.id" :to="`/projetos/${project.slug}`"
          class="mb-6 flex flex-col gap-3 break-inside-avoid rounded-sm border p-5 transition-colors hover:bg-accent">
          <img v-if="project.coverImage" :src="project.coverImage" :alt="project.title"
            class="aspect-video w-full rounded-sm object-cover">
          <h2 class="text-lg font-medium">
            {{ project.title }}
          </h2>
          <p class="text-sm text-muted-foreground">
            {{ project.shortDescription }}
          </p>

          <Separator />

          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <Badge v-if="project.featured" variant="secondary">
                Destaque
              </Badge>
              <Badge :variant="project.isOnline ? 'default' : 'secondary'">
                {{ project.isOnline ? 'Online' : 'Offline' }}
              </Badge>
            </div>
            <span v-if="formatPeriod(project.startDate, project.endDate)"
              class="text-xs whitespace-nowrap text-muted-foreground">
              {{ formatPeriod(project.startDate, project.endDate) }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
