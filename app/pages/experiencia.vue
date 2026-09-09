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
      <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground mt-1">
        A vida como ela é — e o amor por aquilo que perseguimos com genuína dedicação
      </p>
    </div>

    <p>
      Comecei minha carreira no Backend, construindo APIs e aprendendo sobre padrões de desenvolvimento e arquitetura de
      software. Entre 2010 e 2011, trabalhar com Java exigia conhecer não apenas a linguagem, mas todo um ecossistema de
      configurações, persistência, empacotamento e servidores de aplicação. Foi nesse período que trabalhei com
      tecnologias como Java EE, Spring, Hibernate, Maven, Tomcat e JBoss.
    </p>
    <p>
      Sabe aquele ditado de que o mundo dá voltas? Pois é, aconteceu comigo. Com o tempo, minha curiosidade me levou ao
      Frontend, área em que comecei a me destacar e que se conectou naturalmente ao meu interesse por arte, design e por
      transformar ideias em experiências.
    </p>
    <p>
      Em uma das fábricas de software por onde passei, tive a oportunidade de liderar um time de Frontend e me aproximar
      de UX. Essa vivência ampliou minha percepção sobre a criação de produtos e me fez olhar não apenas para como uma
      solução funciona, mas também para a forma como as pessoas interagem com ela.
    </p>
    <p>
      E o mundo deu mais uma volta. Mais tarde, retornei ao Backend, dessa vez com Node.js, e percebi o quanto aquele
      caminho pelo Frontend e por UX havia transformado minha visão como desenvolvedor. Passei a construir APIs pensando
      também em quem iria consumi-las e a enxergar o desenvolvimento de software de forma mais completa, entendendo
      melhor como decisões técnicas influenciam o produto e a experiência de quem o utiliza.
    </p>
    <p>
      Hoje, continuo estudando, experimentando e aprimorando minhas práticas. Depois de tantos anos trabalhando com
      diferentes tecnologias e perspectivas, sigo com a mesma curiosidade: aprender, evoluir e encontrar maneiras
      melhores de transformar ideias em soluções.
    </p>
  </div>
</template>
