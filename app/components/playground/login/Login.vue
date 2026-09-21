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

const panel = 'absolute inset-y-0 w-1/2 transition-all duration-[650ms] ease-in-out'
</script>

<template>
  <div class="flex justify-center">
    <div class="relative h-130 w-full overflow-hidden rounded-lg bg-card">
      <div class="absolute inset-0 z-0 bg-cover bg-center" :style="{ backgroundImage: `url(${heroImage})` }" />

      <div :class="[panel, 'left-1/2 z-20 flex flex-col items-center justify-center gap-4 px-6 text-center text-neutral-50',
        isRegister ? 'invisible translate-x-full opacity-0' : 'visible translate-x-0 opacity-100']">
        <h2 class="text-2xl font-semibold">
          Criar conta
        </h2>

        <p class="text-sm text-neutral-50/85">
          Não adie este momento. Vamos começar juntos a sua jornada.
        </p>

        <button type="button"
          class="cursor-pointer rounded-xl bg-white/10 px-11 py-3 text-base font-semibold backdrop-blur-sm transition-colors duration-300 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2"
          @click="isRegister = true">
          Criar
          <ArrowRight class="size-4" />
        </button>
      </div>

      <div :class="[panel, 'left-0 z-20 flex flex-col items-center justify-center gap-4 px-6 text-center text-neutral-50',
        isRegister ? 'visible translate-x-0 opacity-100' : 'invisible -translate-x-full opacity-0']">
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

      <form :class="[panel, 'left-0 z-10 flex flex-col justify-center gap-3 bg-card/90 px-10 backdrop-blur-md',
        isRegister ? 'invisible translate-x-full opacity-0' : 'visible translate-x-0 opacity-100']" @submit.prevent>
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
