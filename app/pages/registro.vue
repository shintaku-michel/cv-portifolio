<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const { user, pending, error, fetchUser, register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')

onMounted(() => {
  fetchUser()
})

async function onSubmit() {
  try {
    await register(name.value, email.value, password.value)
  } catch {
    // erro já fica disponível em `error`, exibido no template
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>Cadastre-se para curtir e comentar nos posts do blog.</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="user" class="flex flex-col gap-4">
          <p class="text-sm">
            Você já está autenticado como <strong>{{ user.name }}</strong>.
          </p>
          <NuxtLink to="/" class="text-sm underline">
            Voltar para a home
          </NuxtLink>
        </div>

        <form v-else class="flex flex-col gap-4" @submit.prevent="onSubmit">
          <div class="flex flex-col gap-2">
            <Label for="name">Nome</Label>
            <Input id="name" v-model="name" type="text" autocomplete="name" required />
          </div>
          <div class="flex flex-col gap-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="email" type="email" autocomplete="email" required />
          </div>
          <div class="flex flex-col gap-2">
            <Label for="password">Senha</Label>
            <Input id="password" v-model="password" type="password" autocomplete="new-password" minlength="8" required />
          </div>
          <p v-if="error" role="alert" class="text-sm text-destructive">
            {{ error }}
          </p>
          <Button type="submit" :disabled="pending">
            {{ pending ? 'Criando conta…' : 'Criar conta' }}
          </Button>
          <p class="text-center text-sm text-muted-foreground">
            Já tem conta?
            <NuxtLink to="/login" class="underline">
              Entrar
            </NuxtLink>
          </p>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
