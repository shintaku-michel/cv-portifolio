<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { NewspaperIcon } from '@lucide/vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Blog',
  description: 'Artigos técnicos, tutoriais e relatos de projetos.',
  ogTitle: 'Blog — Michel Shintaku',
  ogUrl: `${requestUrl.origin}/blog`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/blog` }] })
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-12 md:mx-auto md:w-3xl md:py-17">
    <div>
      <h1 class="text-2xl font-semibold">
        Blog
      </h1>
      <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground mt-1">
        Projetando coisas que não fazem sentido para todos
      </p>
    </div>

    <p>
      A ideia do blog surgiu, principalmente, como um espaço para testar uma funcionalidade de acessibilidade que
      estou desenvolvendo — um desafio complexo, tanto de mapear quanto de construir.
    </p>
    <p>
      Acessibilidade não é uma questão binária. Pessoas com a mesma deficiência podem ter diferentes graus,
      necessidades e formas de interagir com a tecnologia. Ainda assim, grande parte do mundo digital é projetada a
      partir de experiências padronizadas, sem considerar toda essa diversidade.
    </p>
    <p>
      É justamente esse problema que quero explorar: pensar em experiências digitais capazes de se adaptar melhor às
      diferentes necessidades de cada pessoa.
    </p>

    <div class="mt-6">
      <Button as-child size="lg">
        <NuxtLink to="/posts" class="flex gap-2">
          <NewspaperIcon />
          Acessar o Blog
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>
