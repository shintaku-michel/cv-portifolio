<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Pós-Graduação',
  description: 'Pós-graduação em Full Stack & IA pela Faculdade de Tecnologia Rocketseat.',
  ogTitle: 'Pós-Graduação',
  ogUrl: `${requestUrl.origin}/pos-graduacao`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/pos-graduacao` }] })
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-16">
    <NuxtLink to="/#formacao" class="mb-6 inline-block text-sm text-muted-foreground hover:underline">
      ← Voltar
    </NuxtLink>

    <div class="mb-8 flex flex-col gap-3">
      <h1 class="text-3xl font-semibold">
        Pós-Graduação
      </h1>
      <p class="text-muted-foreground">
        Formação de especialização em desenvolvimento Full Stack e Inteligência Artificial.
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Full Stack & IA</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-muted-foreground">
          Faculdade de Tecnologia Rocketseat
        </p>
      </CardContent>
    </Card>
  </div>
</template>
