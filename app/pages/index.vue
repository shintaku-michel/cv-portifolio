<script setup lang="ts">
import homeBg from '@/assets/img/bg-home.png'
import michelDark from '@/assets/img/michel-dark.png'
import michelLight from '@/assets/img/michel-light.png'
import TechMarquee from '@/components/common/TechMarquee.vue'
import { Button } from '@/components/ui/button'
import { Code2Icon, FolderGit2Icon, MailIcon, MicAudioLines } from '@lucide/vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Início',
  description: 'Projetos, artigos e experiências construídos com Nuxt, GraphQL e PostgreSQL.',
  ogTitle: 'Portfolio CMS',
  ogUrl: requestUrl.origin
})
useHead({ link: [{ rel: 'canonical', href: requestUrl.origin }] })

// Avatar troca de foto junto com o tema global (claro/escuro).
const { theme } = useTheme()
const avatarSrc = computed(() => (theme.value === 'dark' ? michelDark : michelLight))
</script>

<template>
  <section id="inicio"
    class="relative min-h-screen bg-cover bg-center bg-no-repeat lg:h-dvh lg:min-h-0 lg:overflow-hidden"
    :style="{ backgroundImage: `url(${homeBg})` }">
    <!-- Scrim sobre a foto de fundo para garantir contraste do texto. -->
    <div class="absolute inset-0 bg-background/75" aria-hidden="true">
      <div
        class="relative flex min-h-dvh w-full flex-col-reverse items-center justify-center gap-10 px-6 py-16 text-center lg:flex-row lg:gap-24 lg:px-8 lg:py-0 lg:text-start">
        <div class="flex w-full min-w-0 max-w-2xl flex-col items-center lg:w-auto lg:items-start">
          <p class="text-lg font-light text-foreground/70 sm:text-xl">
            こんにちは世界！私は
          </p>
          <h1 class="mt-2 text-4xl font-semibold sm:text-5xl lg:text-6xl">
            Michel Shintaku
          </h1>
          <p class="mt-2 text-2xl font-semibold sm:text-3xl lg:text-4xl">
            Full Stack Developer
          </p>

          <p class="mt-4 font-light text-foreground/70">
            Desenvolvo produtos digitais que unem tecnologia e estratégia, com foco no usuário,
            <br class="hidden sm:inline">transformando necessidades reais em soluções inovadoras.
          </p>

          <div class="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button as-child size="lg">
              <NuxtLink to="/projetos">
                <FolderGit2Icon />
                Conheça meu trabalho
              </NuxtLink>
            </Button>
            <Button as-child size="lg" variant="outline">
              <NuxtLink to="/posts">
                <MicAudioLines />
                Fake Blog
              </NuxtLink>
            </Button>
            <Button as-child size="lg" variant="outline">
              <NuxtLink to="/pagar-um-cafe">
                <MailIcon />
                Contato
              </NuxtLink>
            </Button>
          </div>

          <TechMarquee class="mt-4 w-full max-w-xl" />
        </div>

        <div class="relative shrink-0">
          <img :src="avatarSrc" alt="Michel Shintaku"
            class="h-40 w-40 rounded-full object-cover ring-3 ring-[#aaaaaa] sm:h-52 sm:w-52 lg:h-60 lg:w-60">
          <div
            class="absolute -right-1 -bottom-1 flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-[#999999] lg:h-16 lg:w-16">
            <Code2Icon class="size-6 text-muted-foreground lg:size-8" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
