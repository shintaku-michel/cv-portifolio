<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Post } from '#shared/types/post'

definePageMeta({ middleware: 'admin' })
useHead({ title: 'Admin · Posts' })

const QUERY = `
  query AdminPosts {
    posts {
      id title slug status createdAt
      author { name }
      category { id name }
    }
  }
`

const { data, refresh } = await useAsyncData('admin-posts', () =>
  useGraphQL<{ posts: Post[] }>(QUERY)
)

const actionPending = ref<string | null>(null)

async function togglePublish(post: Post) {
  actionPending.value = post.id
  const mutation = post.status === 'PUBLISHED'
    ? `mutation ($id: ID!) { unpublishPost(id: $id) { id } }`
    : `mutation ($id: ID!) { publishPost(id: $id) { id } }`
  try {
    await useGraphQL(mutation, { id: post.id })
    await refresh()
  } finally {
    actionPending.value = null
  }
}

async function remove(post: Post) {
  if (!confirm(`Excluir o post "${post.title}"? Essa ação não pode ser desfeita.`)) {
    return
  }
  actionPending.value = post.id
  try {
    await useGraphQL(`mutation ($id: ID!) { deletePost(id: $id) }`, { id: post.id })
    await refresh()
  } finally {
    actionPending.value = null
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-12">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-semibold">
        Posts
      </h1>
      <NuxtLink to="/admin/posts/novo">
        <Button>Novo post</Button>
      </NuxtLink>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Autor</TableHead>
          <TableHead class="text-right">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="post in data?.posts ?? []" :key="post.id">
          <TableCell class="font-medium">
            {{ post.title }}
          </TableCell>
          <TableCell>
            <Badge :variant="post.status === 'PUBLISHED' ? 'default' : 'secondary'">
              {{ post.status }}
            </Badge>
          </TableCell>
          <TableCell>{{ post.category?.name ?? '—' }}</TableCell>
          <TableCell>{{ post.author.name }}</TableCell>
          <TableCell class="flex flex-wrap justify-end gap-2">
            <NuxtLink :to="`/admin/posts/${post.id}/editar`">
              <Button size="sm" variant="outline">
                Editar
              </Button>
            </NuxtLink>
            <NuxtLink :to="`/posts/${post.slug}`">
              <Button size="sm" variant="outline">
                Visualizar
              </Button>
            </NuxtLink>
            <Button
              size="sm"
              variant="outline"
              :disabled="actionPending === post.id"
              @click="togglePublish(post)"
            >
              {{ post.status === 'PUBLISHED' ? 'Despublicar' : 'Publicar' }}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              :disabled="actionPending === post.id"
              @click="remove(post)"
            >
              Excluir
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
