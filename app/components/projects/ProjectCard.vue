<script setup lang="ts">
import type { Project } from '#shared/types/project'
import { formatPeriod } from '#shared/utils/format-period'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

defineProps<{
  project: Project
}>()
</script>

<template>
  <NuxtLink :to="`/projetos/${project.slug}`"
    class="flex flex-col gap-3 rounded-sm border p-5 transition-colors hover:bg-accent">
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
</template>
