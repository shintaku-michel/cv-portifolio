<script setup lang="ts">

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Certificados',
  description: 'Certificados e cursos complementares em UX/UI Design, acessibilidade, Frontend, Backend e DevOps.',
  ogTitle: 'Certificados',
  ogUrl: `${requestUrl.origin}/certificados`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/certificados` }] })
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-16">
    <NuxtLink to="/#cursos" class="mb-6 inline-block text-sm text-muted-foreground hover:underline">
      ← Voltar
    </NuxtLink>

    <div class="mb-8 flex flex-col gap-3">
      <h1 class="text-3xl font-semibold">
        Certificados
      </h1>
      <p class="text-muted-foreground">
        em construção
      </p>
    </div>
  </div>
</template>
