<script setup lang="ts">
import type { Certificate } from '#shared/types/certificate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, ExternalLink, GraduationCap, View } from '@lucide/vue';

defineProps<{
  certificate: Certificate
  categoryLabel: string
  completedAtLabel: string
}>()

defineEmits<{
  view: [id: string]
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ certificate.title }}</CardTitle>
      <span class="flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarDays class="h-3.5 w-3.5" />
        Concluído em {{ completedAtLabel }}
      </span>
      <span class="flex items-center gap-2 text-xs text-muted-foreground">
        <GraduationCap class="h-3.5 w-3.5" />
        {{ categoryLabel }}
      </span>
    </CardHeader>
    <CardContent class="flex flex-col gap-3">
      <CardDescription>{{ certificate.description }}</CardDescription>
    </CardContent>
    <CardFooter class="flex flex-wrap gap-2">
      <Button size="sm" :disabled="!certificate.image" @click="$emit('view', certificate.id)">
        <View />
        Visualizar
      </Button>
      <Button v-if="certificate.onlineUrl" as-child size="sm" variant="outline">
        <a :href="certificate.onlineUrl" target="_blank" rel="noopener noreferrer">
          <ExternalLink />
          Certificado online
        </a>
      </Button>
      <span v-else class="px-4 text-muted-foreground">Sem certificado digital</span>
    </CardFooter>
  </Card>
</template>
