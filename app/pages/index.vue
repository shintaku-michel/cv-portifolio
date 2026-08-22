<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Code2Icon } from '@lucide/vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Início',
  description: 'Projetos, artigos e experiências construídos com Nuxt, GraphQL e PostgreSQL.',
  ogTitle: 'Portfolio CMS',
  ogUrl: requestUrl.origin
})
useHead({ link: [{ rel: 'canonical', href: requestUrl.origin }] })

</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-16">
    <div class="mb-16 flex flex-col items-center gap-4 text-center">
      <div class="relative">
        <div class="relative h-32 w-32 overflow-hidden rounded-full ring-3 ring-[#0d9373]">
          <img src="https://avatars.githubusercontent.com/u/12748346?v=4" alt="michel shintaku">
        </div>
        <div
          class="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-white ring-1 ring-[#999999]">
          <Code2Icon class="size-3.5 text-muted-foreground" />
        </div>
      </div>
      <p class="max-w-xl text-muted-foreground">
        こんにちは世界! Meu nome é Michel Shintaku
      </p>
      <h1 class="text-3xl font-semibold">
        Desenvolvedor Fullstack
      </h1>
      <p>
        MISSÃO: Desenvolver produtos digitais inovadores que integrem tecnologia, estratégia e experiência humana
        verdadeira.
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
  </div>
</template>
