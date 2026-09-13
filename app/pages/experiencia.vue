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
  <div class="flex flex-col gap-3 md:px-6 py-12 md:mx-auto md:w-3xl md:py-17">
    <div>
      <h1 class="text-2xl font-semibold">
        Experiência
      </h1>
      <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground mt-1">
        A vida como ela é e o amor por aquilo que buscamos com genuína dedicação
      </p>
    </div>

    <p>
      Comecei minha carreira no backend, desenvolvendo APIs e aprendendo sobre padrões de desenvolvimento e arquitetura
      de software. Entre 2010 e 2011, trabalhar com Java exigia conhecer não apenas a linguagem, mas também um amplo
      ecossistema de configurações, persistência de dados, gerenciamento de dependências, empacotamento e servidores de
      aplicação. Nesse período, trabalhei com tecnologias como Java EE, Spring, Hibernate, Maven, Tomcat e JBoss.
    </p>
    <p>
      Sabe aquele ditado de que o mundo dá voltas? Pois é, aconteceu comigo. Com o tempo, minha curiosidade me levou ao
      frontend. Foi uma área em que comecei a me destacar e que se conectou naturalmente ao meu interesse por arte,
      design e pela transformação de ideias em experiências digitais.
    </p>
    <p>
      Em uma das fábricas de software por onde passei, tive a oportunidade de liderar uma equipe de frontend e me
      aproximar de UX. Essa experiência ampliou minha compreensão sobre a criação de produtos. Passei a observar não
      apenas como uma solução funciona, mas também como as pessoas interagem com ela.
    </p>
    <p>
      E o mundo deu mais uma volta. Mais tarde, retornei ao backend, dessa vez trabalhando com Node.js. Percebi, então,
      o quanto minha experiência com frontend e UX havia ampliado minha visão como desenvolvedor. Passei a criar APIs
      pensando também nas pessoas que iriam utilizá-las e a compreender melhor como cada decisão técnica influencia o
      produto e a experiência de uso.
    </p>
    <p>
      Hoje, continuo estudando, experimentando e ampliando meus conhecimentos. Depois de tantos anos trabalhando com
      diferentes tecnologias e perspectivas, mantenho a curiosidade que sempre orientou minha carreira: aprender,
      evoluir e encontrar maneiras melhores de transformar ideias em soluções que ajudem a resolver problemas do dia a
      dia das pessoas.
    </p>
  </div>
</template>
