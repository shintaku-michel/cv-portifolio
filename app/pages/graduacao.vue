<script setup lang="ts">
import graduacaoCertificate from '@/assets/img/certificados/graduacao.png'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { View } from '@lucide/vue'

const certificateOpen = ref(false)

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
  <div class="md:px-6 py-6 md:mx-auto md:w-3xl md:py-5">
    <NuxtLink to="/formacao" class="mb-6 inline-block text-sm text-muted-foreground hover:underline">
      ← Voltar
    </NuxtLink>

    <div class="mb-8 flex flex-col gap-3">
      <div>
        <h1 class="text-2xl font-semibold">
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
        Concluí a graduação em 2012, após oito semestres de muitos desafios e aprendizados. Naquele período, eu já
        trabalhava com desenvolvimento de software e conciliava a rotina profissional com os estudos. Buscava aprofundar
        meus conhecimentos, crescer na carreira e conquistar melhores oportunidades profissionais e financeiras.
      </p>
      <p>
        Ao longo dessa trajetória, tive excelentes professores, que contribuíram para minha formação técnica e me
        ajudaram a descobrir interesses que influenciaram os caminhos que segui profissionalmente. A graduação também me
        proporcionou amizades que permanecem até hoje, algumas delas transformadas em parcerias
        profissionais.
      </p>
      <p>
        Olhando para essa fase hoje, percebo o quanto é importante confiar no processo, reconhecer o valor de cada
        experiência e compreender que cada etapa, com seus desafios, aprendizados e conquistas, contribui para a
        construção da nossa trajetória.
      </p>
    </div>

    <div class="flex items-center flex-wrap gap-3">
      <Button variant="default" class="px-2.5 py-4.5" @click="certificateOpen = true">
        <View />
        Visualizar
      </Button>

      <span class="px-4 text-muted-foreground">Sem certificado digital</span>
    </div>

    <Dialog v-model:open="certificateOpen">
      <DialogContent class="sm:max-w-3xl">
        <DialogTitle>Certificado — Graduação</DialogTitle>
        <img :src="graduacaoCertificate" alt="Certificado de Graduação em Ciência da Computação"
          class="w-full rounded-sm">
      </DialogContent>
    </Dialog>
  </div>
</template>
