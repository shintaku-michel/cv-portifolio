<script setup lang="ts">
import {
  BookOpenIcon,
  BriefcaseIcon,
  CoffeeIcon,
  CompassIcon,
  FolderGit2Icon,
  GraduationCapIcon,
  HouseIcon,
  MailIcon,
  MoonIcon,
  NewspaperIcon,
  SunIcon,
  UserIcon
} from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Perfil, Valores, Formação, Cursos, Experiência, Contato e Pagar um café
// são páginas reais (não seções por hash) — cada uma indexável com sua
// própria URL/meta tags. Só Projetos e Blog continuam como seções da home,
// por hash: são prévias com link para a página completa (/projetos, /posts).
const navItems = [
  { id: 'inicio', label: 'Início', icon: HouseIcon, to: '/#inicio' },
  { id: 'perfil', label: 'Perfil', icon: UserIcon, to: '/perfil' },
  { id: 'valores', label: 'Valores', icon: CompassIcon, to: '/valores' },
  { id: 'formacao', label: 'Formação', icon: GraduationCapIcon, to: '/formacao' },
  { id: 'cursos', label: 'Cursos', icon: BookOpenIcon, to: '/cursos' },
  { id: 'experiencia', label: 'Experiência', icon: BriefcaseIcon, to: '/experiencia' },
  { id: 'projetos', label: 'Projetos', icon: FolderGit2Icon, to: '/#projetos' },
  { id: 'blog', label: 'Blog', icon: NewspaperIcon, to: '/#blog' },
  { id: 'contato', label: 'Contato', icon: MailIcon, to: '/contato' },
  { id: 'pagar-um-cafe', label: 'Pagar um café', icon: CoffeeIcon, to: '/pagar-um-cafe' }
]

const { theme, setTheme } = useTheme()

function toggleTheme() {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}

const themeToggleLabel = computed(() => theme.value === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro')

// A home é uma experiência de seções em tela cheia: o frame de conteúdo não
// aplica `max-width` nem padding nenhum, para o background de cada `<section>`
// sangrar até as bordas da tela. O espaçamento fica interno, dentro de cada
// seção. Nas demais páginas (posts, projetos, admin) o frame normal permanece.
const route = useRoute()
const isHome = computed(() => route.path === '/')

// Mesma proteção contra hydration mismatch usada em `index.vue`: o hash da
// URL não chega ao servidor, então o SSR sempre renderiza "início" para a
// home. Fora da hidratação inicial (ex: voltando pra "/" via navegação
// client-side) não há risco de mismatch, então dá pra ler a hash real desde
// o primeiro render — daí o `!nuxtApp.isHydrating` no valor inicial.
const nuxtApp = useNuxtApp()
const mounted = ref(import.meta.client && !nuxtApp.isHydrating)
onMounted(() => {
  mounted.value = true
})

// Páginas fora da home que não têm item próprio no menu (ex: /graduacao,
// /pos-graduacao) destacam o item da página-mãe a que pertencem.
const routeNavId: Record<string, string> = {
  '/graduacao': 'formacao',
  '/pos-graduacao': 'formacao',
  '/certificados': 'cursos'
}

const realPageNavIds = new Set(navItems.filter(item => !item.to.startsWith('/#')).map(item => item.id))

const activeNavId = computed(() => {
  if (route.path === '/') {
    if (!mounted.value) return 'inicio'
    return route.hash ? route.hash.slice(1) : 'inicio'
  }
  if (route.path.startsWith('/projetos')) return 'projetos'
  if (route.path.startsWith('/posts')) return 'blog'
  const id = route.path.slice(1)
  if (realPageNavIds.has(id)) return id
  return routeNavId[route.path] ?? null
})
</script>

<template>
  <div class="min-h-dvh">
    <nav
      class="fixed inset-y-0 left-0 z-40 flex w-16 flex-col items-center overflow-y-auto border-r bg-background py-4"
      aria-label="Menu principal"
    >
      <TooltipProvider>
        <div class="flex flex-1 flex-col items-center justify-center gap-1">
          <Tooltip v-for="item in navItems" :key="item.id">
            <TooltipTrigger as-child>
              <NuxtLink
                :to="item.to"
                :aria-label="item.label"
                :aria-current="item.id === activeNavId ? 'page' : undefined"
                class="flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent hover:text-foreground"
                :class="item.id === activeNavId ? 'bg-accent text-foreground' : 'text-muted-foreground'"
              >
                <component :is="item.icon" class="size-5" />
              </NuxtLink>
            </TooltipTrigger>
            <TooltipContent side="right">
              {{ item.label }}
            </TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              :aria-label="themeToggleLabel"
              class="mt-2 shrink-0 text-muted-foreground"
              @click="toggleTheme"
            >
              <SunIcon v-if="theme === 'light'" class="size-5" />
              <MoonIcon v-else class="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {{ themeToggleLabel }}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </nav>

    <a
      href="#main"
      class="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
    >
      Pular para o conteúdo
    </a>

    <main id="main" class="pl-16">
      <div :class="isHome ? '' : 'mx-auto max-w-7xl px-6 py-8'">
        <slot />
      </div>
    </main>
  </div>
</template>
