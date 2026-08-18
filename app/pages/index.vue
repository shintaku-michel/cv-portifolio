<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import type { Project } from '#shared/types/project'

useHead({ title: 'Início' })

const { data, pending, error } = await useAsyncData('home-featured-projects', () =>
  useGraphQL<{ featuredProjects: Project[] }>(`
    query FeaturedProjects {
      featuredProjects {
        id title slug shortDescription coverImage
        technologies { id name slug }
      }
    }
  `)
)
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-16">
    <div class="mb-16 flex flex-col items-center gap-4 text-center">
      <h1 class="text-3xl font-semibold">
        Portfolio CMS
      </h1>
      <p class="max-w-xl text-muted-foreground">
        Projetos, artigos e experiências construídos com Nuxt, GraphQL e PostgreSQL.
      </p>
      <div class="flex gap-3">
        <NuxtLink to="/projetos">
          <Button>Ver projetos</Button>
        </NuxtLink>
        <NuxtLink to="/posts">
          <Button variant="outline">Ler o blog</Button>
        </NuxtLink>
      </div>
    </div>

    <section>
      <h2 class="mb-6 text-xl font-medium">
        Projetos em destaque
      </h2>

      <LoadingState v-if="pending" />
      <ErrorState v-else-if="error" message="Não foi possível carregar os projetos em destaque." />
      <EmptyState v-else-if="!data?.featuredProjects.length" message="Nenhum projeto em destaque no momento." />

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="project in data.featuredProjects"
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
          <h3 class="text-lg font-medium">
            {{ project.title }}
          </h3>
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
    </section>
  </div>
</template>
