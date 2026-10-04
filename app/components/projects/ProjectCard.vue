<script setup lang="ts">
import type { Project } from '#shared/types/project';
import { formatPeriod, toMonthYear } from '#shared/utils/format-period';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const props = defineProps<{
  project: Project
}>()

// Projetos (featured) mostram o período completo; componentes, só o mês de
// publicação.
const dateLabel = computed(() => {
  const { featured, startDate, endDate } = props.project
  if (!startDate) return null
  return `Publicado em: ${featured ? formatPeriod(startDate, endDate) : toMonthYear(startDate)}`
})
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

      <CardFooter class="gap-2">
        <span v-if="dateLabel" class="text-xs whitespace-nowrap text-muted-foreground">
          {{ dateLabel }}
        </span>
        <!-- Componentes (featured = false) não mostram status Online/Offline. -->
        <Badge v-if="project.featured" variant="outline" class="ms-auto"
          :class="project.isOnline
            ? 'border-green-600/40 text-green-700 dark:border-green-400/40 dark:text-green-400'
            : 'border-red-600/40 text-red-700 dark:border-red-400/40 dark:text-red-400'">
          {{ project.isOnline ? 'Online' : 'Offline' }}
        </Badge>
      </CardFooter>
    </Card>
  </NuxtLink>
</template>
