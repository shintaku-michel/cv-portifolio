<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Login dos leitores: só Google. O acesso administrativo (email e senha)
// fica em /login-admin.
useHead({ title: 'Login' })
useSeoMeta({ robots: 'noindex, nofollow' })

const { user, logout } = useAuth()
const route = useRoute()

const redirectTarget = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
const googleLoginUrl = computed(() => `/api/auth/google?redirect=${encodeURIComponent(redirectTarget)}`)
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle><h1 class="contents">Login</h1></CardTitle>
        <CardDescription>Entre com sua conta Google para comentar e curtir posts.</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="user" class="flex flex-col gap-4">
          <p class="text-sm">
            Autenticado como <strong>{{ user.name }}</strong>
          </p>
          <Button size="lg" variant="outline" @click="logout">
            Sair
          </Button>
        </div>

        <Button v-else as-child size="lg" class="w-full">
          <a :href="googleLoginUrl">Entrar com Google</a>
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
