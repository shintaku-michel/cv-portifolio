<script setup lang="ts">
// Componente de playground "button": só demonstra uma configuração
// específica do Button que já existe em @/components/ui/button — mesma
// estrutura de import/uso de qualquer outra página do site (ex:
// app/pages/index.vue). Renderizado no post via <component :is="..."> sem
// props/conteúdo vindo de fora (ver app/pages/projetos/[slug].vue), então
// tudo que aparece no post precisa estar fixado aqui embaixo.
import { Button } from '@/components/ui/button'
import { HeartHandshake } from '@lucide/vue'
</script>

<template>
  <Button size="lg" variant="outline">
    <HeartHandshake />
    Botão Outline
  </Button>
</template>
