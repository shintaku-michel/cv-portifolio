<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { FileBadge } from '@lucide/vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Cursos',
  description: 'Aprendizados direcionados para desafios e necessidades específicas — UX/UI, acessibilidade, Frontend, Backend e DevOps.',
  ogTitle: 'Cursos — Michel Shintaku',
  ogUrl: `${requestUrl.origin}/cursos`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/cursos` }] })
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-12 md:mx-auto md:w-3xl md:py-17">
    <div>
      <h1 class="text-2xl font-semibold">
        Cursos
      </h1>
      <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground mt-1">
        Aprendizados direcionados a desafios e necessidades específicas
      </p>
    </div>

    <p>
      Ao longo da minha carreira, busquei ampliar meus conhecimentos em diferentes áreas do desenvolvimento de software.
      Realizei cursos de UX/UI Design, acessibilidade (A11y), Frontend, Backend e DevOps. A curiosidade sempre me levou
      a compreender as diversas etapas do desenvolvimento, conquistar mais autonomia, explorar novas possibilidades e
      não me limitar a uma única área da tecnologia.
    </p>
    <p>
      Mais do que acumular certificados, procuro adquirir conhecimentos que possam ser aplicados no dia a dia e que
      ampliem minha compreensão sobre todo o processo de criação de produtos digitais.
    </p>

    <div class="mt-6">
      <Button as-child size="lg">
        <NuxtLink to="/certificados" class="flex gap-2">
          <FileBadge />
          Certificados
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>
