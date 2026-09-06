<script setup lang="ts">
import type { Project } from '#shared/types/project'
import { formatPeriod } from '#shared/utils/format-period'
import TechBadge from '@/components/common/TechBadge.vue'
import { Button } from '@/components/ui/button'

const route = useRoute()
const slug = route.params.slug as string

const QUERY = `
  query ProjectDetail($slug: String!) {
    project(slug: $slug) {
      id title slug shortDescription description coverImage gallery status featured
      demoUrl repositoryUrl startDate endDate
      technologies { id name slug }
    }
  }
`

const { data, error } = await useAsyncData(`projeto-${slug}`, () =>
  useGraphQL<{ project: Project | null }>(QUERY, { slug })
)

if (error.value) {
  throw createError({ statusCode: 500, statusMessage: 'Não foi possível carregar o projeto' })
}
if (!data.value?.project) {
  throw createError({ statusCode: 404, statusMessage: 'Projeto não encontrado' })
}

const project = computed(() => data.value!.project!)

const requestUrl = useRequestURL()
const projectUrl = computed(() => `${requestUrl.origin}/projetos/${project.value.slug}`)

useSeoMeta({
  title: project.value.title,
  description: project.value.shortDescription,
  ogTitle: project.value.title,
  ogDescription: project.value.shortDescription,
  ogImage: project.value.coverImage ?? undefined,
  ogUrl: projectUrl.value,
  twitterCard: 'summary_large_image',
  twitterTitle: project.value.title,
  twitterDescription: project.value.shortDescription,
  twitterImage: project.value.coverImage ?? undefined
})

useHead({
  link: [{ rel: 'canonical', href: projectUrl.value }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.value.title,
      description: project.value.shortDescription,
      image: project.value.coverImage ?? undefined,
      url: projectUrl.value,
      keywords: project.value.technologies.map(t => t.name).join(', ') || undefined
    })
  }]
})

</script>

<template>
  <div class="px-6 py-16 md:mx-auto md:w-3xl">
    <NuxtLink to="/projetos" class="mb-6 inline-block text-sm text-muted-foreground hover:underline">
      ← Voltar para projetos
    </NuxtLink>

    <div class="mb-2 flex flex-col items-start gap-2">
      <h1 class="text-2xl font-semibold">
        {{ project.title }}
      </h1>
      <span v-if="formatPeriod(project.startDate, project.endDate)" class="text-xs text-muted-foreground">
        {{ formatPeriod(project.startDate, project.endDate) }}
      </span>
    </div>

    <p class="text-md">
      {{ project.shortDescription }}
    </p>

    <img v-if="project.coverImage" :src="project.coverImage" :alt="project.title"
      class="mb-4 aspect-video w-full rounded-sm object-cover">

    <div class="mt-4 mb-4 flex flex-wrap gap-3">
      <Button v-if="project.demoUrl" as="a" :href="project.demoUrl" target="_blank" rel="noopener noreferrer">
        Ver demonstração
      </Button>
      <Button v-if="project.repositoryUrl" as="a" variant="outline" :href="project.repositoryUrl" target="_blank"
        rel="noopener noreferrer">
        Ver repositório
      </Button>
    </div>

    <div class="prose prose-neutral mb-8 max-w-none whitespace-pre-line dark:prose-invert">
      {{ project.description }}
    </div>

    <div class="mb-4">
      <h2 class="text-md font-semibold mb-4">Stack Tecnológica</h2>
      <div class="flex flex-wrap gap-1.5">
        <TechBadge v-for="tech in project.technologies" :key="tech.id" :name="tech.name" :slug="tech.slug" />
      </div>
    </div>

    <div v-if="project.gallery.length" class="mb-10 grid gap-4 sm:grid-cols-2">
      <img v-for="(image, index) in project.gallery" :key="index" :src="image"
        :alt="`${project.title} — imagem ${index + 1}`" class="w-full rounded-sm object-cover">
    </div>
  </div>
</template>
