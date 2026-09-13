<script setup lang="ts">
import posGraduacaoCertificate from '@/assets/img/certificados/pos-graduacao.png'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ExternalLink, View } from '@lucide/vue'

const ROCKETSEAT_CERTIFICATE_URL = 'https://ftr.rocketseat.com.br/certificates/37443162-c28c-4788-84e7-1e95950dd55c'

const certificateOpen = ref(false)
</script>

<template>
  <div class="md:px-6 py-6 md:mx-auto md:w-3xl md:py-5">
    <NuxtLink to="/formacao" class="mb-6 inline-block text-sm text-muted-foreground hover:underline">
      ← Voltar
    </NuxtLink>

    <div class="mb-8 flex flex-col gap-3">
      <div>
        <h1 class="text-2xl font-semibold">
          Pós-Graduação
        </h1>
        <p class="font-cursive text-xl text-muted-foreground leading-5">
          Desenvolvimento Full Stack e Inteligência Artificial
        </p>
      </div>
      <p>
        Depois de anos trabalhando com desenvolvimento de software, percebi que a inteligência artificial e a automação
        estavam transformando não apenas as tecnologias que usamos, mas também a forma como pensamos, criamos e
        desenvolvemos soluções.
      </p>
      <p>
        Nesse contexto, decidi retomar os estudos e fazer uma pós-graduação em Desenvolvimento Full Stack e Inteligência
        Artificial pela Faculdade de Tecnologia Rocketseat, concluída no início de 2026. A formação me ajudou a
        compreender melhor essas mudanças, ampliar meus conhecimentos e me preparar para novos desafios profissionais.
      </p>
      <p>
        Essa experiência reforçou uma convicção que sempre acompanhou minha carreira: evoluir faz parte da profissão.
        Tecnologias mudam, processos são renovados e novas possibilidades surgem o tempo todo. Por isso, continuar
        aprendendo, experimentando e me adaptando é parte essencial da maneira como escolhi construir minha trajetória.
      </p>
    </div>

    <div class="flex flex-wrap gap-3">
      <Button variant="default" class="px-2.5 py-4.5" @click="certificateOpen = true">
        <View />
        Visualizar
      </Button>
      <Button as-child variant="outline" class="px-2.5 py-4.5">
        <a :href="ROCKETSEAT_CERTIFICATE_URL" target="_blank" rel="noopener noreferrer">
          <ExternalLink />
          Certificado online
        </a>
      </Button>
    </div>

    <Dialog v-model:open="certificateOpen">
      <DialogContent class="sm:max-w-3xl">
        <DialogTitle>Certificado — Pós-Graduação</DialogTitle>
        <img :src="posGraduacaoCertificate"
          alt="Certificado de Pós-Graduação em Desenvolvimento Full Stack e Inteligência Artificial"
          class="w-full rounded-sm">
      </DialogContent>
    </Dialog>
  </div>
</template>
