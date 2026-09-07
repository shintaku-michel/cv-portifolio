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
      <p class="mt-2 font-cursive text-[1.4rem] leading-5 text-muted-foreground">
        Aprendizados direcionados para desafios e necessidades específicas
      </p>
    </div>

    <p>
      Ao longo da minha carreira, busquei ampliar meus conhecimentos em diferentes áreas do desenvolvimento
      de
      software. Tenho cursos em UX/UI Design, acessibilidade (A11y), Frontend, Backend e DevOps. Sempre fui
      muito
      curioso e procurei entender diferentes partes do processo de desenvolvimento para ter mais autonomia,
      explorar
      novas possibilidades e não ficar limitado por uma única área da tecnologia.
    </p>
    <p>
      Mais do que acumular certificados, busco conhecimentos que possam ser aplicados na prática e que me
      ajudem
      a compreender melhor todo o processo de criação dos produtos digitais que desenvolvo.
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
