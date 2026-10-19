<script setup lang="ts">
import CountUp from '@/components/common/CountUp.vue'
import TechMarquee from '@/components/common/TechMarquee.vue'
import ScrollVideoHero from '@/components/home/ScrollVideoHero.vue'
import { Button } from '@/components/ui/button'
import { getTechIcon } from '@/utils/tech-icons'
import { MailIcon } from '@lucide/vue'

const requestUrl = useRequestURL()

// Ícones monocromáticos (currentColor): herdam a cor do texto do botão
// outline, garantindo o mesmo contraste do rótulo nos temas claro e escuro.
const socialLinks = [
  /* { label: 'GitHub', href: 'https://github.com/shintaku-michel', icon: getTechIcon('github') }, */
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mshintaku', icon: getTechIcon('linkedin') }
]

useSeoMeta({
  title: 'Início',
  description: 'Projetos, artigos e experiências construídos com Nuxt, GraphQL e PostgreSQL.',
  ogTitle: 'Portfolio CMS',
  ogUrl: requestUrl.origin
})
useHead({ link: [{ rel: 'canonical', href: requestUrl.origin }] })

// Hero: o vídeo avança com a rolagem e o conteúdo é revelado em sequência
// (`scroll-reveal` + `[--reveal-at:…]`); ao rolar de volta, some na ordem inversa.
</script>

<template>
  <ScrollVideoHero id="inicio" v-slot="{ revealed }" src="/hero/hero-1080.mp4" src-small="/hero/hero-720.mp4"
    poster="/hero/poster.jpg" fallback="/hero/fallback.jpg" :fps="24" :end-at="0.95" :scroll-length="3"
    :reveal-at="0.65" class="text-foreground">
    <div
      class="relative flex w-full flex-1 items-center justify-center px-6 py-16 text-center lg:justify-end lg:px-0 lg:py-0 lg:text-start">
      <!-- Desktop: o conteúdo ocupa metade da largura, alinhado à direita e recuado 150px da borda. -->
      <div
        class="flex w-full min-w-0 max-w-xl flex-col items-center lg:mr-[240.5px] lg:w-2/5 lg:max-w-none lg:items-start lg:px-12 xl:px-20">
        <p class="scroll-reveal text-lg font-light text-foreground/70 [--reveal-at:0.30] sm:text-xl">
          こんにちは世界！私は
        </p>
        <h1
          class="scroll-reveal mt-2 font-display text-4xl leading-[0.95] font-extrabold tracking-[-0.03em] [--reveal-at:0.36] lg:text-6xl">
          Shin Michel
        </h1>
        <p
          class="scroll-reveal mt-2 text-2xl font-cursive [--reveal-at:0.42] sm:text-3xl lg:text-4xl text-blue-600 dark:text-blue-400">
          Full-Stack Developer
        </p>

        <p class="scroll-reveal mt-4 font-light text-foreground/70 [--reveal-at:0.48]">
          Desenvolvo produtos digitais que unem tecnologia e estratégia,
          transformando necessidades em soluções inovadoras.
        </p>

        <div class="scroll-reveal mt-6 flex flex-wrap justify-center gap-3 [--reveal-at:0.54] lg:justify-start">
          <Button v-for="link in socialLinks" :key="link.href" as-child size="lg" variant="outline">
            <a :href="link.href" target="_blank" rel="noopener noreferrer"
              :aria-label="`${link.label} (abre em nova aba)`">
              <svg v-if="link.icon" :viewBox="link.icon.viewBox ?? '0 0 24 24'" aria-hidden="true">
                <path :d="link.icon.path" fill="currentColor" />
              </svg>
              {{ link.label }}
            </a>
          </Button>

          <Button as-child size="lg" variant="outline">
            <NuxtLink to="/pagar-um-cafe">
              <MailIcon />
              Contato
            </NuxtLink>
          </Button>
        </div>

        <TechMarquee class="scroll-reveal mt-4 w-full max-w-lg [--reveal-at:0.60]" />

        <div class="scroll-reveal flex flex-row gap-18 mt-12 w-full max-w-xl [--reveal-at:0.66]">
          <div class="flex flex-col gap-2">
            <p
              class="font-display text-4xl leading-[0.95] font-extrabold tracking-[-0.3rem] lg:text-6xl text-orange-600 dark:text-orange-400/70">
              <CountUp :to="15" :delay="200" :play="revealed" /> +
            </p>
            <span class="text-sm text-muted-foreground">Years Experience</span>
          </div>
          <div class="flex flex-col gap-2">
            <p
              class="font-display text-4xl leading-[0.95] font-extrabold tracking-[-0.3rem] lg:text-6xl text-orange-600 dark:text-orange-400/70">
              <CountUp :to="40" :delay="200" :play="revealed" /> +
            </p>
            <span class="text-sm text-muted-foreground">Projects Delivered</span>
          </div>
        </div>
      </div>
    </div>
  </ScrollVideoHero>
</template>
