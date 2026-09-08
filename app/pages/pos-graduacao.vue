<script setup lang="ts">
import posGraduacaoCertificate from '@/assets/img/certificados/pos-graduacao.png'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ExternalLink, View } from '@lucide/vue'

const ROCKETSEAT_CERTIFICATE_URL = 'https://ftr.rocketseat.com.br/certificates/37443162-c28c-4788-84e7-1e95950dd55c'

const certificateOpen = ref(false)
</script>

<template>
  <div class="px-6 py-12 md:mx-auto md:w-3xl md:py-5">
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
        Depois de anos atuando com desenvolvimento de software, percebi que o mercado estava entrando em um novo
        momento. O avanço da inteligência artificial e da automação de tarefas começou a transformar não apenas as
        tecnologias que utilizamos, mas também a maneira como pensamos, criamos e desenvolvemos soluções.
      </p>
      <p>
        Foi nesse contexto que decidi voltar ao ambiente acadêmico e fazer uma pós-graduação na Faculdade de Tecnologia
        Rocketseat, concluída no início de 2026. Mais do que uma nova formação, foi uma oportunidade de me atualizar,
        compreender melhor essas transformações e me preparar para os novos desafios do mercado de tecnologia.
      </p>
      <p>
        Essa experiência reforçou algo em que sempre acreditei: evoluir faz parte da profissão. Tecnologias mudam,
        processos são reinventados e novas possibilidades surgem constantemente. Continuar aprendendo, experimentando e
        me adaptando é parte essencial da forma como escolhi construir minha carreira.
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
