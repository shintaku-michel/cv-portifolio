<script setup lang="ts">
import TechMarquee from '@/components/common/TechMarquee.vue'
import DeveloperCard from '@/components/home/DeveloperCard.vue'
import { Button } from '@/components/ui/button'
import { FolderGit2Icon, MailIcon, MicAudioLines } from '@lucide/vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Início',
  description: 'Projetos, artigos e experiências construídos com Nuxt, GraphQL e PostgreSQL.',
  ogTitle: 'Portfolio CMS',
  ogUrl: requestUrl.origin
})
useHead({ link: [{ rel: 'canonical', href: requestUrl.origin }] })
</script>

<template>
  <section id="inicio"
    class="relative min-h-screen overflow-x-clip text-foreground lg:h-dvh lg:min-h-0 lg:overflow-hidden">
    <div class="relative">
      <div
        class="relative flex min-h-dvh w-full flex-col-reverse items-center justify-center gap-10 px-6 py-16 text-center lg:flex-row lg:gap-12 lg:px-8 xl:gap-24 lg:py-0 lg:text-start">
        <div class="flex w-full min-w-0 max-w-xl flex-col items-center lg:w-auto lg:items-start">
          <p
            class="text-lg font-light text-foreground/70 motion-safe:animate-hero-fade-up motion-safe:[animation-delay:0.2s] sm:text-xl">
            こんにちは世界！私は
          </p>
          <h1
            class="mt-2 font-display text-4xl leading-[0.95] font-extrabold tracking-[-0.03em] lg:text-7xl motion-safe:animate-hero-fade-up motion-safe:[animation-delay:0.4s]">
            Michel Shintaku
          </h1>
          <p
            class="mt-2 text-2xl font-cursive motion-safe:animate-hero-fade-up motion-safe:[animation-delay:0.6s] sm:text-3xl lg:text-4xl text-blue-600 dark:text-blue-400">
            Full-Stack Developer
          </p>

          <p
            class="mt-4 font-light text-foreground/70 motion-safe:animate-hero-fade-up motion-safe:[animation-delay:0.8s]">
            Desenvolvo produtos digitais que unem tecnologia e estratégia, com foco no usuário,
            transformando necessidades reais em soluções inovadoras.
          </p>

          <div
            class="mt-6 flex flex-wrap justify-center gap-3 motion-safe:animate-hero-fade-up motion-safe:[animation-delay:1s] lg:justify-start">
            <Button as-child size="lg">
              <NuxtLink to="/projetos">
                <FolderGit2Icon />
                Conheça meu trabalho
              </NuxtLink>
            </Button>
            <Button as-child size="lg" variant="outline">
              <NuxtLink to="/blog">
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

          <TechMarquee
            class="mt-4 w-full max-w-xl motion-safe:animate-hero-fade-up motion-safe:[animation-delay:1.1s]" />
        </div>

        <DeveloperCard
          class="shrink-0 motion-safe:animate-hero-slide-in motion-safe:[animation-delay:1.2s] hidden lg:block" />
      </div>
    </div>
  </section>
</template>
