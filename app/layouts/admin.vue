<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ChevronDownIcon, MenuIcon } from '@lucide/vue'

const { user, logout } = useAuth()

// Regra única para todas as páginas admin (seção 31): nunca indexar.
useSeoMeta({ robots: 'noindex, nofollow' })

// Projetos/Posts/Certificados agrupados em "Conteúdo" no menu de desktop:
// são os três CRUDs de cadastro, enquanto Dashboard/Comentários/Usuários
// navegam direto. No menu sanduíche do mobile a lista fica achatada.
const contentLinks = [
  { to: '/admin/projetos', label: 'Projetos' },
  { to: '/admin/posts', label: 'Posts' },
  { to: '/admin/certificados', label: 'Certificados' }
]

const allLinks = [
  { to: '/admin', label: 'Dashboard' },
  ...contentLinks,
  { to: '/admin/comentarios', label: 'Comentários' },
  { to: '/admin/usuarios', label: 'Usuários' }
]

const route = useRoute()
const isContentActive = computed(() => contentLinks.some(link => route.path.startsWith(link.to)))

const mobileMenuOpen = ref(false)

async function onLogout() {
  await logout()
  await navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen">
    <a href="#main"
      class="sr-only px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50">
      Pular para o conteúdo
    </a>
    <header class="border-b">
      <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6 px-4 py-3 sm:px-0">
        <!-- Mobile: menu sanduíche com a navegação achatada num Sheet. -->
        <Sheet v-model:open="mobileMenuOpen">
          <SheetTrigger as-child class="sm:hidden">
            <Button size="icon" variant="outline" aria-label="Abrir menu de administração">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="w-64">
            <SheetHeader>
              <SheetTitle>Administração</SheetTitle>
            </SheetHeader>
            <nav aria-label="Administração" class="flex flex-col gap-1 px-4">
              <NuxtLink v-for="link in allLinks" :key="link.to" :to="link.to"
                class="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                active-class="bg-muted font-medium"
                :exact-active-class="link.to === '/admin' ? 'bg-muted font-medium' : undefined"
                @click="mobileMenuOpen = false">
                {{ link.label }}
              </NuxtLink>
            </nav>
          </SheetContent>
        </Sheet>

        <!-- Desktop: Menubar com "Conteúdo" agrupando os CRUDs de cadastro. -->
        <Menubar aria-label="Administração" class="hidden sm:flex">
          <MenubarMenu>
            <MenubarTrigger as-child>
              <NuxtLink to="/admin" active-class="bg-muted font-medium" exact-active-class="bg-muted font-medium">
                Dashboard
              </NuxtLink>
            </MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger class="group gap-1" :class="isContentActive ? 'bg-muted font-medium' : ''">
              Conteúdo
              <ChevronDownIcon class="size-3.5 transition-transform group-aria-expanded:rotate-180" />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem v-for="link in contentLinks" :key="link.to" class="px-3 py-2" @select="navigateTo(link.to)">
                {{ link.label }}
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger as-child>
              <NuxtLink to="/admin/comentarios" active-class="bg-muted font-medium">
                Comentários
              </NuxtLink>
            </MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger as-child>
              <NuxtLink to="/admin/usuarios" active-class="bg-muted font-medium">
                Usuários
              </NuxtLink>
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>

        <div class="flex items-center gap-3 text-sm text-muted-foreground">
          <span v-if="user" class="hidden sm:inline">{{ user.name }}</span>
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
