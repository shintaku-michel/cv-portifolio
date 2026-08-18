<script setup lang="ts">
import { Button } from '@/components/ui/button'

const { user, logout } = useAuth()

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
    <header class="border-b">
      <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <nav class="flex flex-wrap gap-1">
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
    <main>
      <slot />
    </main>
  </div>
</template>
