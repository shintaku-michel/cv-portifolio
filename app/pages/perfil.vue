<script setup lang="ts">

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Perfil',
  description: 'Um pouco da minha história — de Goiânia e Brasília ao Japão, e como isso ajudou a moldar quem sou hoje.',
  ogTitle: 'Perfil — Michel Shintaku',
  ogUrl: `${requestUrl.origin}/perfil`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/perfil` }] })
</script>

<template>
  <div class="flex flex-col gap-3 md:px-6 py-12 md:mx-auto md:w-3xl md:py-17">
    <div>
      <h1 class="text-2xl font-semibold">
        Perfil
      </h1>
      <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground mt-1">
        Leal aos meus valores e comprometido com as minhas escolhas
      </p>
    </div>

    <p>
      Nasci em Goiânia e cresci em Brasília. Desde cedo, a arte esteve presente na minha vida e se tornou
      parte importante da minha formação.
    </p>
    <p>
      A tecnologia, o design, a música e a cultura japonesa estão entre as principais influências que
      despertaram minha criatividade e ajudaram a moldar quem sou
      hoje.
    </p>

    <p>
      Aos 14 anos, tive a oportunidade de viver por quase uma década no Japão, uma experiência que
      transformou minha forma de enxergar o mundo e aprofundou valores como disciplina, honestidade,
      organização,
      resiliência e senso de coletividade. Essa vivência ampliou minha perspectiva e fortaleceu princípios que
      carrego comigo e que, até hoje, fazem parte de quem sou.
    </p>

    <p>
      Hoje, sou desenvolvedor Full Stack e tenho mais de 18 anos de experiência no desenvolvimento web. Minha trajetória
      na tecnologia começou em 2005 e, desde 2007, trabalho profissionalmente transformando ideias e necessidades em
      soluções digitais.
    </p>

    <p>
      Ao longo da minha trajetória, sempre busquei criar experiências que unam tecnologia, usabilidade, acessibilidade e
      regras de negócio, mantendo o foco no que realmente importa: as pessoas que usam o produto.
    </p>
  </div>
</template>
