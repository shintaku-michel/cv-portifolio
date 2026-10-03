<script setup lang="ts">
import type { Project } from '#shared/types/project';
import { formatPeriod } from '#shared/utils/format-period';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

defineProps<{
  project: Project
}>()
</script>

<template>
  <!-- Mesma superfície do CertificateCard (Card do shadcn-vue); o link envolve
       o card inteiro, com anel de foco próprio para navegação por teclado. -->
  <NuxtLink :to="`/projetos/${project.slug}`"
    class="group/project block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
    <Card class="transition-colors group-hover/project:ring-foreground/25">
      <CardContent class="flex flex-col gap-3">
        <h2 v-if="project.featured" class="text-lg font-medium">
          {{ project.title }}
        </h2>
        <img v-if="project.coverImage" :src="project.coverImage" :alt="project.title"
          class="rounded-sm">
        <p class="text-sm text-muted-foreground">
          {{ project.shortDescription }}
        </p>
      </CardContent>

      <CardFooter class="justify-between gap-2">
        <Badge variant="outline"
          :class="project.isOnline
            ? 'border-green-600/40 text-green-700 dark:border-green-400/40 dark:text-green-400'
            : 'border-red-600/40 text-red-700 dark:border-red-400/40 dark:text-red-400'">
          {{ project.isOnline ? 'Online' : 'Offline' }}
        </Badge>
        <span v-if="formatPeriod(project.startDate, project.endDate)"
          class="text-xs whitespace-nowrap text-muted-foreground">
          {{ formatPeriod(project.startDate, project.endDate) }}
        </span>
      </CardFooter>
    </Card>
  </NuxtLink>
</template>
