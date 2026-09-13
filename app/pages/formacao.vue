<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { FileBadge } from '@lucide/vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Formação',
  description: 'Acredito na transformação por meio do conhecimento — graduação em Ciência da Computação e pós-graduação em Full Stack & IA.',
  ogTitle: 'Formação — Michel Shintaku',
  ogUrl: `${requestUrl.origin}/formacao`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/formacao` }] })
</script>

<template>
  <div class="flex flex-col gap-3 md:px-6 py-12 md:mx-auto md:w-3xl md:py-17">
    <div>
      <h1 class="text-2xl font-semibold">
        Formação
      </h1>
      <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground mt-1">
        Acredito na transformação por meio do conhecimento
      </p>
    </div>

    <p>
      Sou graduado em Ciência da Computação pelo Centro Universitário de Brasília (CEUB) e pós-graduado em Full Stack &
      IA pela Faculdade de Tecnologia Rocketseat. Essa formação, somada a mais de 18 anos de experiência em
      desenvolvimento web, me permite unir fundamentos da computação, prática em desenvolvimento de software e
      conhecimento técnico para escolher as tecnologias mais adequadas para escolha de cada solução digital.
    </p>
    <p>
      Ao longo da minha trajetória, mantenho o compromisso de continuar estudando, explorando novas tecnologias e
      aprofundando conhecimentos que contribuam para a qualidade do meu trabalho.
    </p>
    <p>
      Também considero essencial ter humildade para reconhecer que não sabemos tudo, aprender com o conhecimento e a
      experiência de outras pessoas e permanecer aberto a novas formas de pensar e construir.
    </p>

    <div class="mt-6 flex gap-2">
      <Button as-child size="lg">
        <NuxtLink to="/pos-graduacao" class="flex gap-2">
          <FileBadge />
          Pós-Graduação
        </NuxtLink>
      </Button>
      <Button as-child size="lg">
        <NuxtLink to="/graduacao" class="flex gap-2">
          <FileBadge />
          Graduação
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>
