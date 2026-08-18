<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Comment, CommentStatus } from '#shared/types/comment'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin · Comentários' })

const statusTabs: { value: CommentStatus, label: string }[] = [
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'VISIBLE', label: 'Publicados' },
  { value: 'HIDDEN', label: 'Ocultos' }
]

const activeStatus = ref<CommentStatus>('PENDING')

const QUERY = `
  query AdminComments($status: CommentStatus!) {
    adminComments(status: $status) {
      id content status createdAt
      user { name email }
      post { title slug }
    }
  }
`

const { data, refresh, pending } = await useAsyncData(
  () => `admin-comments-${activeStatus.value}`,
  () => useGraphQL<{ adminComments: Comment[] }>(QUERY, { status: activeStatus.value }),
  { watch: [activeStatus] }
)

const actionPending = ref<string | null>(null)

async function approve(comment: Comment) {
  actionPending.value = comment.id
  try {
    await useGraphQL(`mutation ($id: ID!) { approveComment(id: $id) { id } }`, { id: comment.id })
    await refresh()
  } finally {
    actionPending.value = null
  }
}

async function hide(comment: Comment) {
  actionPending.value = comment.id
  try {
    await useGraphQL(`mutation ($id: ID!) { hideComment(id: $id) { id } }`, { id: comment.id })
    await refresh()
  } finally {
    actionPending.value = null
  }
}

async function remove(comment: Comment) {
  if (!confirm('Excluir este comentário? Essa ação não pode ser desfeita.')) {
    return
  }
  actionPending.value = comment.id
  try {
    await useGraphQL(`mutation ($id: ID!) { deleteComment(id: $id) }`, { id: comment.id })
    await refresh()
  } finally {
    actionPending.value = null
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-12">
    <h1 class="mb-6 text-2xl font-semibold">
      Comentários
    </h1>

    <div class="mb-6 flex gap-2">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        type="button"
        class="rounded-full border px-3 py-1 text-sm transition-colors"
        :class="activeStatus === tab.value ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'"
        @click="activeStatus = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="pending">
      Carregando…
    </div>
    <p v-else-if="!data?.adminComments.length" class="text-muted-foreground">
      Nenhum comentário nesse status.
    </p>

    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead>Comentário</TableHead>
          <TableHead>Autor</TableHead>
          <TableHead>Post</TableHead>
          <TableHead class="text-right">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="comment in data.adminComments" :key="comment.id">
          <TableCell class="max-w-xs">
            {{ comment.content }}
          </TableCell>
          <TableCell>
            <div class="flex flex-col">
              <span>{{ comment.user.name }}</span>
              <span class="text-xs text-muted-foreground">{{ comment.user.email }}</span>
            </div>
          </TableCell>
          <TableCell>
            <NuxtLink :to="`/posts/${comment.post.slug}`" class="hover:underline">
              {{ comment.post.title }}
            </NuxtLink>
          </TableCell>
          <TableCell class="flex flex-wrap justify-end gap-2">
            <Button
              v-if="comment.status !== 'VISIBLE'"
              size="sm"
              variant="outline"
              :disabled="actionPending === comment.id"
              @click="approve(comment)"
            >
              Aprovar
            </Button>
            <Button
              v-if="comment.status !== 'HIDDEN'"
              size="sm"
              variant="outline"
              :disabled="actionPending === comment.id"
              @click="hide(comment)"
            >
              Ocultar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              :disabled="actionPending === comment.id"
              @click="remove(comment)"
            >
              Excluir
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
