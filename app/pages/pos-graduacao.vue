<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { View } from '@lucide/vue';

</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-16">
    <NuxtLink to="/formacao" class="mb-6 inline-block text-sm text-muted-foreground hover:underline">
      ← Voltar
    </NuxtLink>

    <div class="mb-8 flex flex-col gap-3">
      <div>
        <h1 class="text-3xl font-semibold">
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

    <Button variant="default" class="px-2.5 py-4.5">
      <View />
      Visualizar certificado
    </Button>
  </div>
</template>
