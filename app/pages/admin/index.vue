<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SessionUser } from '#shared/types/auth'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin · Dashboard' })

const QUERY = `
  query AdminDashboard {
    projects { id status }
    posts { id status }
    pendingComments { id }
    users { id role }
  }
`

const { data } = await useAsyncData('admin-dashboard', () =>
  useGraphQL<{
    projects: { id: string, status: string }[]
    posts: { id: string, status: string }[]
    pendingComments: { id: string }[]
    users: SessionUser[]
  }>(QUERY)
)

const stats = computed(() => {
  const projects = data.value?.projects ?? []
  const posts = data.value?.posts ?? []
  return [
    { label: 'Projetos publicados', value: projects.filter(p => p.status === 'PUBLISHED').length, to: '/admin/projetos' },
    { label: 'Projetos em rascunho', value: projects.filter(p => p.status === 'DRAFT').length, to: '/admin/projetos' },
    { label: 'Posts publicados', value: posts.filter(p => p.status === 'PUBLISHED').length, to: '/admin/posts' },
    { label: 'Posts em rascunho', value: posts.filter(p => p.status === 'DRAFT').length, to: '/admin/posts' },
    { label: 'Comentários pendentes', value: data.value?.pendingComments.length ?? 0, to: '/admin/comentarios' },
    { label: 'Usuários', value: data.value?.users.length ?? 0, to: '/admin/usuarios' }
  ]
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-12">
    <h1 class="mb-6 text-2xl font-semibold">
      Dashboard
    </h1>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink v-for="stat in stats" :key="stat.label" :to="stat.to">
        <Card class="transition-colors hover:bg-accent">
          <CardHeader>
            <CardTitle class="text-sm font-normal text-muted-foreground">
              {{ stat.label }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-semibold">
              {{ stat.value }}
            </p>
          </CardContent>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>
