<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { View } from '@lucide/vue';

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Graduação',
  description: 'Graduação em Ciência da Computação pelo Centro Universitário de Brasília (CEUB).',
  ogTitle: 'Graduação',
  ogUrl: `${requestUrl.origin}/graduacao`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/graduacao` }] })
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-16">
    <NuxtLink to="/#formacao" class="mb-6 inline-block text-sm text-muted-foreground hover:underline">
      ← Voltar
    </NuxtLink>

    <div class="mb-8 flex flex-col gap-3">
      <div>
        <h1 class="text-3xl font-semibold">
          Graduação
        </h1>
        <p class="font-cursive text-xl text-muted-foreground leading-5">
          Bacharelado em Ciência da Computação
        </p>
      </div>
      <p>
        Minha formação em Ciência da Computação pelo UniCEUB, em Brasília, foi uma etapa importante na construção da
        minha carreira e na forma como enxergo a tecnologia hoje. Durante a graduação, construí uma base sólida em
        lógica, algoritmos, estruturas de dados, programação, bancos de dados e engenharia de software.
      </p>
      <p>
        Concluí o curso em 2012, após oito semestres de muitos desafios e aprendizados. Na época, eu já trabalhava com
        desenvolvimento de software e conciliava a rotina profissional com os estudos, buscando crescer na carreira,
        ampliar meus conhecimentos e conquistar melhores oportunidades profissionais e financeiras.
      </p>
      <p>
        Durante essa trajetória, tive ótimos professores, que contribuíram não apenas para a minha formação técnica, mas
        também para que eu descobrisse afinidades e interesses que ajudaram a definir os caminhos que segui
        profissionalmente. A graduação também me proporcionou amizades que permanecem até hoje, algumas das quais se
        transformaram, ao longo dos anos, em parcerias profissionais.
      </p>
      <p>
        Olhando para essa fase hoje, percebo o quanto é importante confiar no processo, reconhecer o valor de cada
        experiência e compreender que cada etapa, com seus desafios, aprendizados e conquistas, contribui para a
        construção da nossa trajetória.
      </p>
    </div>

    <Button variant="default" class="px-2.5 py-4.5">
      <View />
      Visualizar certificado
    </Button>
  </div>
</template>
