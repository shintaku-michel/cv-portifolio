<script setup lang="ts">
import {
  BookOpenIcon,
  BriefcaseIcon,
  CoffeeIcon,
  CompassIcon,
  FolderGit2Icon,
  GraduationCapIcon,
  HouseIcon,
  MoonIcon,
  NewspaperIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  SunIcon,
  UserIcon
} from '@lucide/vue'
import NavProfile from '@/components/layout/NavProfile.vue'
import { isNavItemActive } from '@/utils/nav'

// Todas as páginas são rotas reais e indexáveis, cada uma com seu próprio SEO.
// `matches` lista as rotas que destacam o item — inclusive páginas sem item
// próprio no menu (ex: /graduacao destaca Formação, /posts/* destaca Blog).
const navItems = [
  { id: 'inicio', label: 'Início', icon: HouseIcon, to: '/', matches: ['/'] },
  { id: 'perfil', label: 'Perfil', icon: UserIcon, to: '/perfil', matches: ['/perfil'] },
  { id: 'valores', label: 'Valores', icon: CompassIcon, to: '/valores', matches: ['/valores'] },
  { id: 'formacao', label: 'Formação', icon: GraduationCapIcon, to: '/formacao', matches: ['/formacao', '/graduacao', '/pos-graduacao'] },
  { id: 'cursos', label: 'Cursos', icon: BookOpenIcon, to: '/cursos', matches: ['/cursos', '/certificados'] },
  { id: 'experiencia', label: 'Experiência', icon: BriefcaseIcon, to: '/experiencia', matches: ['/experiencia'] },
  { id: 'projetos', label: 'Projetos', icon: FolderGit2Icon, to: '/projetos', matches: ['/projetos'] },
  { id: 'blog', label: 'Blog', icon: NewspaperIcon, to: '/blog', matches: ['/blog', '/posts'] },
  { id: 'pagar-um-cafe', label: 'Pagar um café', icon: CoffeeIcon, to: '/pagar-um-cafe', matches: ['/pagar-um-cafe'] }
]

const route = useRoute()
const activeNavId = computed(() => navItems.find(item => isNavItemActive(route.path, item.matches))?.id)

const { theme, setTheme } = useTheme()

function toggleTheme() {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}

// Texto visível curto para caber na nav; o nome acessível descreve a ação e
// contém o texto visível (WCAG 2.5.3).
const themeToggleText = computed(() => theme.value === 'dark' ? 'Tema claro' : 'Tema escuro')
const themeToggleLabel = computed(() => `Mudar para ${themeToggleText.value.toLowerCase()}`)

// Menu fixado aberto (preferência do visitante) ou recolhido, abrindo no
// hover. Fixar só vale a partir de `md`: no mobile a nav segue só com ícones.
const { pinned, togglePinned } = useNavPinned()
const pinLabel = computed(() => pinned.value ? 'Recolher menu' : 'Manter menu aberto')

// Os nomes aparecem com a nav expandida: fixada, em hover ou com foco de teclado.
const labelClass = computed(() => [
  'whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-200 group-hover/nav:opacity-100 group-hover/nav:delay-100 group-has-focus-visible/nav:opacity-100 motion-reduce:transition-none',
  pinned.value ? 'md:opacity-100' : ''
])

// Realce único que desliza até o item sob o mouse (ou com foco de teclado).
// Ao reaparecer, só o fade é animado: ele surge já no item, sem deslizar a
// partir da última posição. Mede o `<li>` (cujo offsetParent é a `<ul>`), e
// não o link — o `<li>` é `relative`, então o offsetTop do link seria sempre 0.
const highlight = reactive({ top: 0, visible: false, slide: false })

function moveHighlight(event: Event) {
  const el = event.currentTarget as HTMLElement
  highlight.slide = highlight.visible
  highlight.top = el.offsetTop
  highlight.visible = true
}

function hideHighlight() {
  highlight.visible = false
}

function onListFocusOut(event: FocusEvent) {
  const list = event.currentTarget as HTMLElement
  if (!list.contains(event.relatedTarget as Node | null)) hideHighlight()
}
</script>

<template>
  <!-- Recolhida: 64px só com ícones. Com hover (só em dispositivos com mouse —
       o `hover:` do Tailwind v4 já é limitado a `(hover: hover)`) ou foco de
       teclado, expande por cima do conteúdo mostrando os nomes. Fixada, fica
       expandida e o layout recua o conteúdo (sem sombra: não está por cima). -->
  <nav
    class="group/nav fixed inset-y-0 left-0 z-40 flex w-16 flex-col overflow-x-hidden overflow-y-auto border-r bg-background px-3 py-4 transition-[width,box-shadow] duration-300 ease-out hover:w-56 has-focus-visible:w-56 motion-reduce:transition-none"
    :class="pinned ? 'md:w-56' : 'hover:shadow-xl has-focus-visible:shadow-xl'"
    aria-label="Menu principal"
  >
    <button
      type="button"
      :aria-label="pinLabel"
      class="hidden h-10 shrink-0 items-center gap-3 rounded-lg px-2.5 text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 md:flex"
      @click="togglePinned"
    >
      <!-- A seta do ícone aponta para o lado em que a nav vai: direita = abrir. -->
      <PanelRightOpenIcon v-if="pinned" class="size-5 shrink-0" aria-hidden="true" />
      <PanelRightCloseIcon v-else class="size-5 shrink-0" aria-hidden="true" />
      <span :class="labelClass">{{ pinLabel }}</span>
    </button>

    <NavProfile :pinned="pinned" :label-class="labelClass" />

    <ul
      class="relative mt-4 flex flex-1 flex-col gap-1"
      @mouseleave="hideHighlight"
      @focusout="onListFocusOut"
    >
      <li
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-0 h-10 rounded-lg bg-accent ease-out motion-reduce:transition-none"
        :class="[
          highlight.slide ? 'transition-[translate,opacity] duration-200' : 'transition-opacity duration-150',
          highlight.visible ? 'opacity-100' : 'opacity-0'
        ]"
        :style="{ translate: `0 ${highlight.top}px` }"
      />

      <li
        v-for="item in navItems"
        :key="item.id"
        class="relative"
        @mouseenter="moveHighlight"
        @focusin="moveHighlight"
      >
        <!-- Item ativo: fundo + barra na borda esquerda da nav, para o estado
             não depender só de cor e não se confundir com o realce do hover. -->
        <NuxtLink
          :to="item.to"
          :aria-current="item.id === activeNavId ? 'page' : undefined"
          class="relative flex h-10 items-center gap-3 rounded-lg px-2.5 outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          :class="item.id === activeNavId
            ? 'bg-accent text-foreground before:absolute before:-left-3 before:h-6 before:w-1 before:rounded-r-full before:bg-foreground'
            : 'text-muted-foreground'"
        >
          <component :is="item.icon" class="size-5 shrink-0" aria-hidden="true" />
          <span :class="labelClass">{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>

    <button
      type="button"
      :aria-label="themeToggleLabel"
      class="mt-2 flex h-10 shrink-0 items-center gap-3 rounded-lg px-2.5 text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      @click="toggleTheme"
    >
      <SunIcon v-if="theme === 'light'" class="size-5 shrink-0" aria-hidden="true" />
      <MoonIcon v-else class="size-5 shrink-0" aria-hidden="true" />
      <span :class="labelClass">{{ themeToggleText }}</span>
    </button>
  </nav>
</template>
