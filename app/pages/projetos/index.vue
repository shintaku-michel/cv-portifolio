<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import type { Project, Technology } from '#shared/types/project'

useHead({ title: 'Projetos' })

const QUERY = `
  query PublicProjects {
    projects {
      id title slug shortDescription coverImage featured
      technologies { id name slug }
    }
    technologies { id name slug }
  }
`

const { data, pending, error } = await useAsyncData('projetos', () =>
  useGraphQL<{ projects: Project[], technologies: Technology[] }>(QUERY)
)

const selectedTechnologyId = ref<string>('')

const filteredProjects = computed(() => {
  const projects = data.value?.projects ?? []
  if (!selectedTechnologyId.value) {
    return projects
  }
  return projects.filter(p => p.technologies.some(t => t.id === selectedTechnologyId.value))
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-12">
    <h1 class="mb-2 text-3xl font-semibold">
      Projetos
    </h1>
    <p class="mb-8 text-muted-foreground">
      Trabalhos, sistemas e experiências que desenvolvi.
    </p>

    <div v-if="pending">
      Carregando…
    </div>
    <div v-else-if="error" role="alert" class="text-destructive">
      Não foi possível carregar os projetos.
    </div>
    <template v-else>
      <div v-if="data?.technologies.length" class="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-full border px-3 py-1 text-sm transition-colors"
          :class="!selectedTechnologyId ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'"
          @click="selectedTechnologyId = ''"
        >
          Todas
        </button>
        <button
          v-for="tech in data.technologies"
          :key="tech.id"
          type="button"
          class="rounded-full border px-3 py-1 text-sm transition-colors"
          :class="selectedTechnologyId === tech.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'"
          @click="selectedTechnologyId = tech.id"
        >
          {{ tech.name }}
        </button>
      </div>

      <p v-if="filteredProjects.length === 0" class="text-muted-foreground">
        Nenhum projeto encontrado.
      </p>

      <div v-else class="grid gap-6 sm:grid-cols-2">
        <NuxtLink
          v-for="project in filteredProjects"
          :key="project.id"
          :to="`/projetos/${project.slug}`"
          class="flex flex-col gap-3 rounded-lg border p-5 transition-colors hover:bg-accent"
        >
          <img
            v-if="project.coverImage"
            :src="project.coverImage"
            :alt="project.title"
            class="aspect-video w-full rounded-md object-cover"
          >
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-medium">
              {{ project.title }}
            </h2>
            <Badge v-if="project.featured" variant="secondary">
              Destaque
            </Badge>
          </div>
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
    </template>
  </div>
</template>
