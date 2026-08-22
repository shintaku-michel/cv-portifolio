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
  NewspaperIcon,
  UserIcon
} from '@lucide/vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const navItems = [
  { id: 'inicio', label: 'Início', icon: HouseIcon },
  { id: 'perfil', label: 'Perfil', icon: UserIcon },
  { id: 'valores', label: 'Valores', icon: CompassIcon },
  { id: 'formacao', label: 'Formação', icon: GraduationCapIcon },
  { id: 'cursos', label: 'Cursos', icon: BookOpenIcon },
  { id: 'experiencia', label: 'Experiência', icon: BriefcaseIcon },
  { id: 'projetos', label: 'Projetos', icon: FolderGit2Icon },
  { id: 'blog', label: 'Blog', icon: NewspaperIcon },
  { id: 'contato', label: 'Contato', icon: MailIcon },
  { id: 'pagar-um-cafe', label: 'Pagar um café', icon: CoffeeIcon }
]
</script>

<template>
  <div class="min-h-dvh">
    <nav
      class="fixed inset-y-0 left-0 z-40 flex w-16 flex-col items-center justify-center gap-1 overflow-y-auto border-r bg-background py-4"
      aria-label="Menu principal"
    >
      <TooltipProvider>
        <Tooltip v-for="item in navItems" :key="item.id">
          <TooltipTrigger as-child>
            <NuxtLink
              :to="`/#${item.id}`"
              :aria-label="item.label"
              class="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <component :is="item.icon" class="size-5" />
            </NuxtLink>
          </TooltipTrigger>
          <TooltipContent side="right">
            {{ item.label }}
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
      <div class="mx-auto max-w-7xl px-6 py-8">
        <slot />
      </div>
    </main>
  </div>
</template>
