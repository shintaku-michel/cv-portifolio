<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { NewspaperIcon } from '@lucide/vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Blog',
  description: 'Artigos técnicos, tutoriais e relatos de projetos.',
  ogTitle: 'Blog — Michel Shintaku',
  ogUrl: `${requestUrl.origin}/blog`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/blog` }] })
</script>

<template>
  <div class="flex flex-col gap-3 md:px-6 py-12 md:mx-auto md:w-3xl md:py-17">
    <div>
      <h1 class="text-2xl font-semibold">
        Blog
      </h1>
      <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground mt-1">
        Projetando coisas que não fazem sentido para todos
      </p>
    </div>

    <p>
      A ideia deste blog surgiu, principalmente, como um espaço para experimentar uma funcionalidade de acessibilidade
      que estou desenvolvendo, um desafio complexo, tanto de compreender e mapear quanto de transformar em uma
      experiência digital realmente útil.
    </p>
    <p>
      Uma coisa que percebi recentemente é que acessibilidade não é uma questão binária. Pessoas com a mesma deficiência
      podem apresentar diferentes graus, necessidades, preferências e formas de interagir com a tecnologia. Pode parecer
      óbvio, mas, para mim, não foi.
    </p>
    <p>
      Por isso, quero explorar justamente este problema: como criar experiências digitais que se adaptem melhor às
      necessidades de cada pessoa, em vez de esperar que todas se adaptem à mesma interface.
    </p>
    <p>
      Este experimento ainda não é um produto. Ele está em fase de ideação, pesquisa e testes de usabilidade. Por isso,
      não espere encontrar aqui um portal de notícias ou novidades a cada visita, pois essa não é a proposta.
    </p>
    <p>
      O conteúdo é, antes de tudo, um meio para testar o Leitor Imersivo em
      situações
      reais de leitura, observar seu
      comportamento e colher feedbacks que possam orientar sua evolução.
    </p>
    <p>
      Os comentários também fazem parte desse experimento. A ideia é que sejam usados principalmente para compartilhar
      percepções, dificuldades e sugestões sobre o Leitor Imersivo — e não necessariamente para discutir os assuntos dos
      textos publicados. Mas isso também não precisa ser uma regra. Sinta-se à vontade para participar da conversa e
      deixar sua contribuição da forma que fizer mais sentido para você.
    </p>

    <div class="mt-4">
      <Button as-child size="lg">
        <NuxtLink to="/posts" class="flex gap-2">
          <NewspaperIcon />
          Acessar o Blog
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>
