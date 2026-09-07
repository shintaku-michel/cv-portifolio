<script setup lang="ts">
const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Valores',
  description: 'Experiências que vivi e que carrego para uma vida mais equilibrada.',
  ogTitle: 'Valores — Michel Shintaku',
  ogUrl: `${requestUrl.origin}/valores`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/valores` }] })
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-12 md:mx-auto md:w-3xl md:py-17">
    <div>
      <h1 class="text-2xl font-semibold">
        Valores
      </h1>
      <p class="mt-2 font-cursive text-[1.4rem] leading-5 text-muted-foreground">
        Experiências que vivi e que carrego para uma vida mais equilibrada
      </p>
    </div>

    <p>
      Acredito que um bom trabalho começa com planejamento, disciplina e aprendizado contínuo. A tecnologia
      está sempre mudando, e acompanhar essa evolução faz parte do nosso trabalho. Reaprender, experimentar e
      estar
      disposto a mudar também são formas de evoluir.
    </p>
    <p>
      Prefiro a comunicação direta e honesta. Problemas devem ser compartilhados o quanto antes, antes que
      se tornem maiores. Questionar, pedir ajuda, ouvir diferentes perspectivas e compartilhar conhecimento
      também
      fazem parte do trabalho em equipe.
    </p>
    <p>
      A inspiração pode iniciar uma ideia, mas é a consistência que a transforma em resultado. Pequenos
      avanços,
      repetidos ao longo do tempo, fazem as coisas acontecerem. Os desafios fazem parte do processo, e
      enfrentá-los
      com paciência e persistência também faz parte do trabalho.
    </p>
    <p>
      Os melhores sistemas que construí ao longo da minha carreira nasceram ao lado de pessoas que realmente
      se importam com o que fazem.
    </p>
    <p>
      Escolha bem as pessoas com quem você trabalha. E, quando não puder escolher, lembre-se: você ainda pode
      fazer a sua parte, elevar o nível ao seu redor e contribuir para um ambiente mais colaborativo,
      respeitoso e comprometido com a excelência.
    </p>
    <p>
      Não romantize os erros. Reconheça-os, corrija o que for possível, mude o curso quando necessário,
      aprenda com eles e siga em frente.
    </p>
  </div>
</template>
