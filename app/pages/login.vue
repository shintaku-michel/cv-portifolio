<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

useHead({ title: 'Login' })

const { user, pending, error, login, logout } = useAuth()
const route = useRoute()

const email = ref('')
const password = ref('')

const redirectTarget = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
const googleLoginUrl = computed(() => `/api/auth/google?redirect=${encodeURIComponent(redirectTarget)}`)

async function onSubmit() {
  try {
    await login(email.value, password.value)
    password.value = ''
  } catch {
    // erro já fica disponível em `error`, exibido no template
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle><h1 class="contents">Login</h1></CardTitle>
        <CardDescription>Acesse com sua conta do Portfolio CMS.</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="user" class="flex flex-col gap-4">
          <p class="text-sm">
            Autenticado como <strong>{{ user.name }}</strong> ({{ user.role }})
          </p>
          <Button v-if="user.role === 'ADMIN'" variant="outline" as-child>
            <NuxtLink to="/admin/perfil">Editar perfil</NuxtLink>
          </Button>
          <Button variant="outline" @click="logout">
            Sair
          </Button>
        </div>

        <div v-else class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <Button as-child>
              <a :href="googleLoginUrl">Entrar com Google</a>
            </Button>
            <p class="text-center text-xs text-muted-foreground">
              Para comentar e curtir posts.
            </p>
          </div>

          <div class="flex items-center gap-3 text-xs text-muted-foreground">
            <span class="h-px flex-1 bg-border" />
            Acesso administrativo
            <span class="h-px flex-1 bg-border" />
          </div>

          <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
            <div class="flex flex-col gap-2">
              <Label for="email">Email</Label>
              <Input id="email" v-model="email" type="email" autocomplete="email" required />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="password">Senha</Label>
              <Input id="password" v-model="password" type="password" autocomplete="current-password" required />
            </div>
            <p v-if="error" role="alert" class="text-sm text-destructive">
              {{ error }}
            </p>
            <Button type="submit" variant="outline" :disabled="pending">
              {{ pending ? 'Entrando…' : 'Entrar' }}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
