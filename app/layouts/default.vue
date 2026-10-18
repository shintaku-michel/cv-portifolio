<script setup lang="ts">
import MainNav from '@/components/layout/MainNav.vue'

// A home é uma experiência de seções em tela cheia: o frame de conteúdo não
// aplica `max-width` nem padding nenhum, para o background de cada `<section>`
// sangrar até as bordas da tela. O espaçamento fica interno, dentro de cada
// seção. Nas demais páginas (posts, projetos, admin) o frame normal permanece.
const route = useRoute()
const isHome = computed(() => route.path === '/')

// Com o menu fixado aberto (a partir de `md`), o conteúdo recua junto em vez
// de ficar por baixo da nav.
const { pinned } = useNavPinned()
</script>

<template>
  <div class="min-h-dvh">
    <!-- Primeiro elemento focável da página: o Tab inicial chega aqui antes
         de percorrer os itens do menu. -->
    <a
      href="#main"
      class="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
    >
      Pular para o conteúdo
    </a>

    <MainNav />

    <main
      id="main"
      class="pl-16 transition-[padding] duration-300 ease-out motion-reduce:transition-none"
      :class="{ 'md:pl-56': pinned }"
    >
      <div :class="isHome ? '' : 'mx-auto max-w-7xl px-6 py-8'">
        <slot />
      </div>
    </main>
  </div>
</template>
