<script setup lang="ts">
// Port do card de login/registro com painel deslizante (imagem + texto
// convidando a trocar de lado, formulário desliza junto) pra Vue, usando
// shadcn-vue (Input, Label, Button) + Tailwind. Cores via tokens de tema
// (bg-card, text-foreground etc.) em vez de hex/neutral fixos — os campos
// usam o estilo padrão do shadcn sem override, adaptando ao tema
// claro/escuro do site como o resto do app.
//
// Sem props (ver app/components/playground/card/Card.vue pro motivo):
// os campos não enviam nada de verdade, é só a interação/animação.
import TechIcon from '@/components/common/TechIcon.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon } from '@lucide/vue'

const heroImage = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80'

const isRegister = ref(false)
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)

const panel = 'absolute inset-y-0 w-1/2 transition-all duration-[650ms] ease-in-out'
</script>

<template>
  <div class="flex justify-center">
    <div class="relative h-130 w-full overflow-hidden rounded-lg bg-card">
      <div class="absolute inset-0 z-0 bg-cover bg-center" :style="{ backgroundImage: `url(${heroImage})` }" />

      <div :class="[panel, 'left-1/2 z-20 flex flex-col items-center justify-center gap-4 px-6 text-center text-neutral-50',
        isRegister ? 'invisible translate-x-full opacity-0' : 'visible translate-x-0 opacity-100']">
        <h2 class="text-2xl font-semibold">
          Hello there
        </h2>
        <p class="text-sm leading-relaxed text-neutral-50/85">
          Begin your journey with us — crie sua conta em poucos segundos.
        </p>
        <button type="button"
          class="cursor-pointer rounded-xl bg-white/10 px-11 py-3 text-base font-semibold backdrop-blur-sm transition-colors duration-300 hover:bg-neutral-50 hover:text-neutral-900"
          @click="isRegister = true">
          Sign Up
        </button>
      </div>

      <div :class="[panel, 'left-0 z-20 flex flex-col items-center justify-center gap-4 px-6 text-center text-neutral-50',
        isRegister ? 'visible translate-x-0 opacity-100' : 'invisible -translate-x-full opacity-0']">
        <h2 class="text-2xl font-semibold">
          Welcome back
        </h2>
        <p class="text-sm leading-relaxed text-neutral-50/85">
          Login to review your dashboard and pick up where you left off.
        </p>
        <button type="button"
          class="cursor-pointer rounded-xl bg-white/10 px-11 py-3 text-base font-semibold backdrop-blur-sm transition-colors duration-300 hover:bg-neutral-50 hover:text-neutral-900"
          @click="isRegister = false">
          Login
        </button>
      </div>

      <form :class="[panel, 'left-0 z-10 flex flex-col justify-center gap-3 bg-card/90 px-10 backdrop-blur-md',
        isRegister ? 'invisible translate-x-full opacity-0' : 'visible translate-x-0 opacity-100']" @submit.prevent>
        <h1 class="mb-4 text-xl font-semibold text-foreground">
          Login
        </h1>

        <div class="flex flex-col gap-1.5">
          <Label for="login-email">E-mail</Label>
          <Input id="login-email" type="email" placeholder="shin@example.com" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="login-password">Senha</Label>
          <div class="relative">
            <Input id="login-password" :type="showLoginPassword ? 'text' : 'password'" placeholder="••••••••"
              class="pr-10" />
            <button type="button"
              class="absolute inset-y-0 right-3 flex cursor-pointer items-center text-muted-foreground hover:text-foreground"
              :aria-label="showLoginPassword ? 'Ocultar senha' : 'Mostrar senha'"
              @click="showLoginPassword = !showLoginPassword">
              <EyeOffIcon v-if="showLoginPassword" class="size-4" />
              <EyeIcon v-else class="size-4" />
            </button>
          </div>
        </div>

        <Button type="submit" class="mt-1 w-full rounded-xl cursor-pointer">
          Entrar
        </Button>

        <div class="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span class="h-px flex-1 bg-border" />
          Ou entre com
          <span class="h-px flex-1 bg-border" />
        </div>
        <div class="flex justify-center gap-3">
          <button type="button" aria-label="Entrar com Google"
            class="flex size-10 cursor-pointer items-center justify-center rounded-full border border-border transition-colors hover:bg-muted">
            <TechIcon slug="google-oauth" />
          </button>
        </div>
      </form>

      <form :class="[panel, 'left-1/2 z-10 flex flex-col justify-center gap-3 bg-card/90 px-10 backdrop-blur-md',
        isRegister ? 'visible translate-x-0 opacity-100' : 'invisible -translate-x-full opacity-0']" @submit.prevent>
        <h1 class="mb-4 text-xl font-semibold text-foreground">
          Criar uma conta
        </h1>

        <div class="flex flex-col gap-1.5">
          <Label for="register-name">Nome</Label>
          <Input id="register-name" type="text" placeholder="Seu nome" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="register-email">E-mail</Label>
          <Input id="register-email" type="email" placeholder="shin@example.com" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="register-password">Senha</Label>
          <div class="relative">
            <Input id="register-password" :type="showRegisterPassword ? 'text' : 'password'" placeholder="••••••••"
              class="pr-10" />
            <button type="button"
              class="absolute inset-y-0 right-3 flex cursor-pointer items-center text-muted-foreground hover:text-foreground"
              :aria-label="showRegisterPassword ? 'Ocultar senha' : 'Mostrar senha'"
              @click="showRegisterPassword = !showRegisterPassword">
              <EyeOffIcon v-if="showRegisterPassword" class="size-4" />
              <EyeIcon v-else class="size-4" />
            </button>
          </div>
        </div>

        <Button type="submit" class="mt-1 w-full rounded-xl cursor-pointer">
          Cadastrar
        </Button>
      </form>
    </div>
  </div>
</template>
