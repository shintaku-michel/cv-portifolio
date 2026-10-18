<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { googleAvatarAtSize } from '@/utils/avatar'
import { LogInIcon, LogOutIcon, UserRoundIcon } from '@lucide/vue'
import type { HTMLAttributes } from 'vue'

// Área de perfil da nav. Nome, e-mail e foto vêm do Google no login
// (server/api/auth/google/callback.get.ts) e chegam aqui pela sessão. A
// mesma moldura redonda serve para foto e para o ícone de visitante.
const props = defineProps<{
  /** Nav expandida pelo visitante (fixada) — a partir de `md`. */
  pinned: boolean
  /** Classe dos textos que só aparecem com a nav expandida. */
  labelClass: HTMLAttributes['class']
}>()

const { user, logout } = useAuth()

// 2x o tamanho exibido (55px) para a foto ficar nítida em telas de alta densidade.
const avatarSrc = computed(() => user.value?.avatarUrl ? googleAvatarAtSize(user.value.avatarUrl, 110) : undefined)

// Volta para a página atual depois do login com Google.
const route = useRoute()
const loginUrl = computed(() => `/login?redirect=${encodeURIComponent(route.fullPath)}`)

const loggingOut = ref(false)

async function onLogout() {
  loggingOut.value = true
  try {
    await logout()
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <!-- Cartão do perfil: borda de 1px + padding de 8px, então a largura útil
       com a nav aberta é 182px (200 − 2 − 16) — os elementos de largura fixa
       abaixo usam essa medida. Recolhida, a nav tem só 40px úteis e a borda
       encostaria no avatar: ela fica transparente e aparece ao abrir. -->
  <div
    class="mt-4 flex shrink-0 flex-col rounded-lg border border-transparent p-2 transition-colors duration-300 group-hover/nav:border-border group-has-focus-visible/nav:border-border motion-reduce:transition-none"
    :class="{ 'md:border-border': props.pinned }">
    <Avatar
      class="size-13.75 scale-[0.7273] self-center bg-muted transition-[scale] duration-300 ease-out group-hover/nav:scale-100 group-has-focus-visible/nav:scale-100 motion-reduce:transition-none"
      :class="{ 'md:scale-100': props.pinned }">
      <AvatarImage v-if="avatarSrc" :src="avatarSrc" alt="" referrer-policy="no-referrer" />
      <AvatarFallback>
        <UserRoundIcon class="size-1/2" aria-hidden="true" />
      </AvatarFallback>
    </Avatar>

    <template v-if="user">
      <div class="mt-3 min-w-0 text-center">
        <p class="truncate text-sm font-semibold" :class="props.labelClass">
          {{ user.name }}
        </p>
        <p class="truncate text-xs text-muted-foreground" :class="props.labelClass">
          {{ user.email }}
        </p>
      </div>

      <!-- Mesmo comportamento do "Entrar": só aparece com a nav aberta. -->
      <Button variant="ghost" size="sm" :disabled="loggingOut"
        class="mt-2 h-10 w-45.5 pointer-events-none group-hover/nav:pointer-events-auto group-has-focus-visible/nav:pointer-events-auto"
        :class="[props.labelClass, { 'md:pointer-events-auto': props.pinned }]" @click="onLogout">
        <LogOutIcon class="size-4" aria-hidden="true" />
        Sair
      </Button>
    </template>

    <template v-else>
      <!-- Largura fixa de 182px (a área útil do cartão com a nav aberta): o
           texto quebra sempre nas mesmas linhas e a altura não muda ao
           abrir/recolher. -->
      <p class="mt-3 w-45.5 text-center text-xs whitespace-normal! text-muted-foreground" :class="props.labelClass">
        Faça login para comentar e curtir posts e componentes
      </p>

      <!-- Botão na largura da nav, conteúdo centralizado. Só aparece com a nav aberta: recolhida fica transparente e sem clique,
           mas mantém o espaço (a altura não muda) e continua no Tab — o foco
           de teclado abre a nav e o torna visível. -->
      <Button as-child variant="ghost" size="sm"
        class="mt-2 h-10 w-45.5 pointer-events-none group-hover/nav:pointer-events-auto group-has-focus-visible/nav:pointer-events-auto"
        :class="[props.labelClass, { 'md:pointer-events-auto': props.pinned }]">
        <NuxtLink :to="loginUrl">
          <LogInIcon class="size-4" aria-hidden="true" />
          Entrar
        </NuxtLink>
      </Button>
    </template>
  </div>
</template>
