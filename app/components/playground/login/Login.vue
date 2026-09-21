<script setup lang="ts">
import TechIcon from '@/components/common/TechIcon.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, EyeIcon, EyeOffIcon } from '@lucide/vue'

const heroImage = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80'

const isRegister = ref(false)
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)

// Empilhado no mobile (fluxo normal, só o painel ativo renderiza) e o
// slide lado a lado a partir do md (posicionamento absoluto, w-1/2).
const heroPanel = 'z-20 flex-col items-center justify-center gap-4 px-6 py-10 text-center text-neutral-50 w-full md:absolute md:inset-y-0 md:w-1/2 md:py-0 md:transition-all md:duration-[650ms] md:ease-in-out'
const formPanel = 'z-10 flex-col gap-3 bg-card/90 px-6 py-8 backdrop-blur-md w-full md:absolute md:inset-y-0 md:w-1/2 md:justify-center md:px-10 md:py-0 md:transition-all md:duration-[650ms] md:ease-in-out'
</script>

<template>
  <div class="flex justify-center">
    <div class="relative w-full overflow-hidden rounded-lg bg-card md:h-130">
      <div class="absolute inset-0 z-0 bg-cover bg-center" :style="{ backgroundImage: `url(${heroImage})` }" />

      <div
        :class="[heroPanel, 'md:left-1/2',
          isRegister ? 'hidden md:flex md:invisible md:translate-x-full md:opacity-0' : 'flex md:flex md:visible md:translate-x-0 md:opacity-100']">
        <h2 class="text-2xl font-semibold">
          Olá! Bem-vindo
        </h2>

        <p class="text-sm text-neutral-50/85">
          Não adie este momento. Vamos começar juntos a sua jornada.
        </p>

        <button type="button"
          class="cursor-pointer rounded-xl bg-white/10 px-11 py-3 text-base font-semibold backdrop-blur-sm transition-colors duration-300 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2"
          @click="isRegister = true">
          Criar conta
          <ArrowRight class="size-4" />
        </button>
      </div>

      <div
        :class="[heroPanel, 'md:left-0',
          isRegister ? 'flex md:flex md:visible md:translate-x-0 md:opacity-100' : 'hidden md:flex md:invisible md:-translate-x-full md:opacity-0']">
        <h2 class="text-2xl font-semibold">
          Fazer login
        </h2>

        <p class="text-sm text-neutral-50/85">
          O sucesso vem do compromisso de melhorar um pouco mais todos os dias.
        </p>

        <button type="button"
          class="cursor-pointer rounded-xl bg-white/10 px-11 py-3 text-base font-semibold backdrop-blur-sm transition-colors duration-300 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2"
          @click="isRegister = false">
          <ArrowLeft class="size-4" />
          Login
        </button>
      </div>

      <form
        :class="[formPanel, 'md:left-0',
          isRegister ? 'hidden md:flex md:invisible md:translate-x-full md:opacity-0' : 'flex md:flex md:visible md:translate-x-0 md:opacity-100']"
        @submit.prevent>
        <h1 class="mb-4 text-xl font-semibold text-foreground">
          Login
        </h1>

        <div class="flex flex-col gap-1.5">
          <Label for="login-email">E-mail</Label>
          <Input id="login-email" type="email" placeholder="shin@example.com" class="h-10" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="login-password">Senha</Label>
          <div class="relative">
            <Input id="login-password" :type="showLoginPassword ? 'text' : 'password'" placeholder="••••••••"
              class="pr-10 h-10" />
            <button type="button"
              class="absolute inset-y-0 right-3 flex cursor-pointer items-center text-muted-foreground hover:text-foreground"
              :aria-label="showLoginPassword ? 'Ocultar senha' : 'Mostrar senha'"
              @click="showLoginPassword = !showLoginPassword">
              <EyeOffIcon v-if="showLoginPassword" class="size-4" />
              <EyeIcon v-else class="size-4" />
            </button>
          </div>
        </div>

        <Button type="submit" class="mt-1 w-full rounded-xl cursor-pointer h-10">
          Entrar
        </Button>

        <div class="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span class="h-px flex-1 bg-border" />
          Ou entre com
          <span class="h-px flex-1 bg-border" />
        </div>
        <div class="flex justify-center gap-3">
          <button type="button" aria-label="Entrar com Google"
            class="group flex size-10 cursor-pointer items-center justify-center rounded-full border border-border transition-colors hover:bg-muted">
            <TechIcon slug="google-oauth" class="size-6! opacity-40 transition-opacity group-hover:opacity-100" />
          </button>
          <button type="button" aria-label="Entrar com Microsoft"
            class="group flex size-10 cursor-pointer items-center justify-center rounded-full border border-border transition-colors hover:bg-muted">
            <TechIcon slug="microsoft" class="size-6! opacity-40 transition-opacity group-hover:opacity-100" />
          </button>
          <button type="button" aria-label="Entrar com Facebook"
            class="group flex size-10 cursor-pointer items-center justify-center rounded-full border border-border transition-colors hover:bg-muted">
            <TechIcon slug="facebook" class="size-6! opacity-40 transition-opacity group-hover:opacity-100" />
          </button>
        </div>
      </form>

      <form
        :class="[formPanel, 'md:left-1/2',
          isRegister ? 'flex md:flex md:visible md:translate-x-0 md:opacity-100' : 'hidden md:flex md:invisible md:-translate-x-full md:opacity-0']"
        @submit.prevent>
        <h1 class="mb-4 text-xl font-semibold text-foreground">
          Criar conta
        </h1>

        <div class="flex flex-col gap-1.5">
          <Label for="register-name">Nome</Label>
          <Input id="register-name" type="text" placeholder="Seu nome" class="h-10" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="register-email">E-mail</Label>
          <Input id="register-email" type="email" placeholder="shin@example.com" class="h-10" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="register-password">Senha</Label>
          <div class="relative">
            <Input id="register-password" :type="showRegisterPassword ? 'text' : 'password'" placeholder="••••••••"
              class="pr-10 h-10" />
            <button type="button"
              class="absolute inset-y-0 right-3 flex cursor-pointer items-center text-muted-foreground hover:text-foreground"
              :aria-label="showRegisterPassword ? 'Ocultar senha' : 'Mostrar senha'"
              @click="showRegisterPassword = !showRegisterPassword">
              <EyeOffIcon v-if="showRegisterPassword" class="size-4" />
              <EyeIcon v-else class="size-4" />
            </button>
          </div>
        </div>

        <Button type="submit" class="mt-1 w-full rounded-xl cursor-pointer h-10">
          Cadastrar
        </Button>
      </form>
    </div>
  </div>
</template>
