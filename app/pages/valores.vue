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
      <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground mt-1">
        Experiências que vivi e que carrego para uma vida mais equilibrada
      </p>
    </div>

    <p>
      Acredito que um bom trabalho começa com planejamento, disciplina e aprendizado contínuo. A tecnologia está sempre
      mudando, e acompanhar essa evolução faz parte do nosso trabalho. Reaprender, experimentar e estar disposto a mudar
      também são formas de evoluir.
    </p>
    <p>
      Prefiro uma comunicação direta e honesta. Problemas devem ser compartilhados o quanto antes, antes que se tornem
      maiores. Questionar, pedir ajuda, ouvir diferentes perspectivas e compartilhar conhecimento fazem parte de um bom
      trabalho em equipe.
    </p>
    <p>
      A inspiração pode dar início a uma ideia, mas é a consistência que a transforma em resultado. São os pequenos
      avanços, repetidos ao longo do tempo, que constroem algo significativo. Os desafios fazem parte do caminho, e
      enfrentá-los com paciência, dedicação e persistência também faz parte do processo.
    </p>
    <p>
      Os melhores sistemas que construí ao longo da minha carreira nasceram ao lado de pessoas que realmente se importam
      com o que fazem. Competência é importante, mas comprometimento, respeito e vontade de construir algo bem feito
      fazem muita diferença.
    </p>
    <p>
      Escolha bem as pessoas com quem você trabalha. E, quando não puder escolher, lembre-se de que ainda pode fazer a
      sua parte: elevar o nível ao seu redor e contribuir para um ambiente mais colaborativo, respeitoso e comprometido
      com a qualidade.
    </p>
    <p>
      Não romantize os erros. Reconheça-os, corrija o que for possível, mude o curso quando necessário e aprenda com
      eles. Errar faz parte do processo; permanecer no mesmo erro, não. Aprenda, ajuste o caminho e siga em frente.
    </p>
  </div>
</template>
