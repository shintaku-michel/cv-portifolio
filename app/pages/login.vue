<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const { user, pending, error, fetchUser, login, logout } = useAuth()

const email = ref('')
const password = ref('')

onMounted(() => {
  fetchUser()
})

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
        <CardTitle>Login</CardTitle>
        <CardDescription>Acesse com sua conta do Portfolio CMS.</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="user" class="flex flex-col gap-4">
          <p class="text-sm">
            Autenticado como <strong>{{ user.name }}</strong> ({{ user.role }})
          </p>
          <Button variant="outline" @click="logout">
            Sair
          </Button>
        </div>

        <form v-else class="flex flex-col gap-4" @submit.prevent="onSubmit">
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
          <Button type="submit" :disabled="pending">
            {{ pending ? 'Entrando…' : 'Entrar' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
