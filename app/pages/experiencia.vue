<script setup lang="ts">
const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Experiência',
  description: 'A vida como ela é — e o amor por aquilo que perseguimos com genuína dedicação.',
  ogTitle: 'Experiência — Michel Shintaku',
  ogUrl: `${requestUrl.origin}/experiencia`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/experiencia` }] })
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-12 md:mx-auto md:w-3xl md:py-17">
    <div>
      <h1 class="text-2xl font-semibold">
        Experiência
      </h1>
      <p class="mt-2 font-cursive text-[1.4rem] leading-5 text-muted-foreground">
        A vida como ela é — e o amor por aquilo que perseguimos com genuína dedicação
      </p>
    </div>

    <p>
      Comecei minha carreira no Backend, construindo APIs e aprendendo sobre padrões de desenvolvimento e
      arquitetura de software. Entre 2010 e 2011, trabalhar com Java exigia conhecer não apenas a linguagem,
      mas todo um ecossistema de configurações, persistência, empacotamento e servidores de aplicação. Foi
      quando trabalhei com tecnologias como Java EE, Spring, Hibernate, Maven, Tomcat e JBoss.
    </p>
    <p>
      Com o tempo, minha curiosidade me levou ao Frontend, área em que comecei a me destacar e que se conectou
      naturalmente ao meu interesse por arte, design e pelo processo de transformar ideias em experiências. Em
      uma das fábricas de software por onde passei, tive a oportunidade de liderar um time de Frontend e
      também me aproximar de UX, ampliando minha percepção sobre a construção de produtos.
    </p>
    <p>
      Mais tarde, voltei ao Backend, dessa vez com Node.js, e percebi o quanto essa experiência havia
      transformado minha visão como desenvolvedor. Passei a construir APIs pensando também em quem iria
      consumi-las e a enxergar o desenvolvimento de software de forma mais completa, entendendo como decisões
      técnicas influenciam o produto e a experiência de quem o utiliza.
    </p>
    <p>
      Hoje, continuo estudando, experimentando e aprimorando minhas práticas, sempre buscando evoluir e
      encontrar maneiras melhores de transformar ideias em soluções.
    </p>
  </div>
</template>
