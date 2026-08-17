<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Project } from '#shared/types/project'

const route = useRoute()
const slug = route.params.slug as string

const QUERY = `
  query ProjectDetail($slug: String!) {
    project(slug: $slug) {
      id title slug shortDescription description coverImage gallery status featured
      demoUrl repositoryUrl startDate endDate
      technologies { id name slug }
    }
    projects {
      id title slug shortDescription coverImage
      technologies { id name slug }
    }
  }
`

const { data } = await useAsyncData(`projeto-${slug}`, () =>
  useGraphQL<{ project: Project | null, projects: Project[] }>(QUERY, { slug })
)

if (!data.value?.project) {
  throw createError({ statusCode: 404, statusMessage: 'Projeto não encontrado' })
}

const project = computed(() => data.value!.project!)

useHead({ title: project.value.title })

// "Projeto relacionado" (seção 10): outros projetos publicados que
// compartilham ao menos uma tecnologia, sem regra explícita no CLAUDE.md.
const relatedProjects = computed(() => {
  const currentTechIds = new Set(project.value.technologies.map(t => t.id))
  return (data.value?.projects ?? [])
    .filter(p => p.slug !== project.value.slug && p.technologies.some(t => currentTechIds.has(t.id)))
    .slice(0, 3)
})

function formatPeriod(start: string | null, end: string | null) {
  if (!start) return null
  const startLabel = start.slice(0, 7)
  const endLabel = end ? end.slice(0, 7) : 'atual'
  return `${startLabel} — ${endLabel}`
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12">
    <NuxtLink to="/projetos" class="mb-6 inline-block text-sm text-muted-foreground hover:underline">
      ← Voltar para projetos
    </NuxtLink>

    <div class="mb-2 flex items-center gap-2">
      <h1 class="text-3xl font-semibold">
        {{ project.title }}
      </h1>
      <Badge v-if="project.featured" variant="secondary">
        Destaque
      </Badge>
    </div>
    <p class="mb-6 text-lg text-muted-foreground">
      {{ project.shortDescription }}
    </p>

    <img
      v-if="project.coverImage"
      :src="project.coverImage"
      :alt="project.title"
      class="mb-6 aspect-video w-full rounded-lg object-cover"
    >

    <div class="mb-6 flex flex-wrap gap-2">
      <Badge v-for="tech in project.technologies" :key="tech.id" variant="outline">
        {{ tech.name }}
      </Badge>
    </div>

    <div class="mb-6 flex flex-wrap gap-3">
      <Button v-if="project.demoUrl" as="a" :href="project.demoUrl" target="_blank" rel="noopener noreferrer">
        Ver demonstração
      </Button>
      <Button v-if="project.repositoryUrl" as="a" variant="outline" :href="project.repositoryUrl" target="_blank" rel="noopener noreferrer">
        Ver repositório
      </Button>
    </div>

    <p v-if="formatPeriod(project.startDate, project.endDate)" class="mb-6 text-sm text-muted-foreground">
      Período: {{ formatPeriod(project.startDate, project.endDate) }}
    </p>

    <div class="prose prose-neutral mb-10 max-w-none whitespace-pre-line dark:prose-invert">
      {{ project.description }}
    </div>

    <div v-if="project.gallery.length" class="mb-10 grid gap-4 sm:grid-cols-2">
      <img
        v-for="(image, index) in project.gallery"
        :key="index"
        :src="image"
        :alt="`${project.title} — imagem ${index + 1}`"
        class="w-full rounded-lg object-cover"
      >
    </div>

    <div v-if="relatedProjects.length">
      <h2 class="mb-4 text-xl font-medium">
        Projetos relacionados
      </h2>
      <div class="grid gap-4 sm:grid-cols-3">
        <NuxtLink
          v-for="related in relatedProjects"
          :key="related.id"
          :to="`/projetos/${related.slug}`"
          class="rounded-lg border p-4 text-sm transition-colors hover:bg-accent"
        >
          {{ related.title }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
