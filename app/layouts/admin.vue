<script setup lang="ts">
import { Button } from '@/components/ui/button'

const { user, logout } = useAuth()

// Regra única para todas as páginas admin (seção 31): nunca indexar.
useSeoMeta({ robots: 'noindex, nofollow' })

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/projetos', label: 'Projetos' },
  { to: '/admin/posts', label: 'Posts' },
  { to: '/admin/comentarios', label: 'Comentários' },
  { to: '/admin/usuarios', label: 'Usuários' }
]

async function onLogout() {
  await logout()
  await navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen">
    <a
      href="#main"
      class="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
    >
      Pular para o conteúdo
    </a>
    <header class="border-b">
      <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <nav aria-label="Administração" class="flex flex-wrap gap-1">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent"
            active-class="bg-accent font-medium"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
        <div class="flex items-center gap-3 text-sm text-muted-foreground">
          <span v-if="user">{{ user.name }}</span>
          <Button size="sm" variant="outline" @click="onLogout">
            Sair
          </Button>
        </div>
      </div>
    </header>
    <main id="main">
      <slot />
    </main>
  </div>
</template>
