<script setup lang="ts">
const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Contato',
  description: 'Entre em contato com Michel Shintaku.',
  ogTitle: 'Contato — Michel Shintaku',
  ogUrl: `${requestUrl.origin}/contato`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/contato` }] })
</script>

<template>
  <div class="flex flex-col gap-4 px-6 py-12 md:mx-auto md:w-3xl md:py-17">
    <h1 class="text-2xl font-semibold">
      Contato
    </h1>
    <p class="text-muted-foreground">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam facilis aut molestiae cupiditate
      nesciunt enim quos sed ad. Natus quaerat expedita earum id sed sapiente obcaecati. Sint totam possimus
      illo!
    </p>
  </div>
</template>
