<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Graduação',
  description: 'Graduação em Ciência da Computação pelo Centro Universitário de Brasília (CEUB).',
  ogTitle: 'Graduação',
  ogUrl: `${requestUrl.origin}/graduacao`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/graduacao` }] })
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-16">
    <NuxtLink to="/#formacao" class="mb-6 inline-block text-sm text-muted-foreground hover:underline">
      ← Voltar
    </NuxtLink>

    <div class="mb-8 flex flex-col gap-3">
      <h1 class="text-3xl font-semibold">
        Graduação
      </h1>
      <p class="text-muted-foreground">
        Formação acadêmica em Ciência da Computação.
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Ciência da Computação</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-muted-foreground">
          Centro Universitário de Brasília (CEUB)
        </p>
      </CardContent>
    </Card>
  </div>
</template>
