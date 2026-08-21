<script setup lang="ts">
import type { Post } from '#shared/types/post'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EllipsisIcon, EyeIcon, EyeOffIcon, PencilIcon, Trash2Icon, UploadIcon } from '@lucide/vue'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin · Posts' })

const QUERY = `
  query AdminPosts {
    posts {
      id title slug status createdAt
      author { name }
      category { id name }
      tags { id name }
    }
  }
`

const { data, pending, error, refresh } = await useAsyncData('admin-posts', () =>
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

const confirmDeleteTarget = ref<Post | null>(null)

async function confirmDelete() {
  const target = confirmDeleteTarget.value
  if (!target) return

  actionPending.value = target.id
  try {
    await useGraphQL(`mutation ($id: ID!) { deletePost(id: $id) }`, { id: target.id })
    await refresh()
    confirmDeleteTarget.value = null
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

    <LoadingState v-if="pending" />
    <ErrorState v-else-if="error" message="Não foi possível carregar os posts." />
    <EmptyState v-else-if="!data?.posts.length" message="Nenhum post cadastrado ainda." />

    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead>Título/Autor</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Status</TableHead>
          <TableHead class="text-right">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="post in data?.posts ?? []" :key="post.id">
          <TableCell class="font-medium">
            <p>{{ post.title }}</p>
            <p class="text-sm text-muted-foreground">{{ post.author.name }}</p>
          </TableCell>

          <TableCell>{{ post.category?.name ?? '—' }}</TableCell>

          <TableCell>
            <div v-if="post.tags.length" class="flex flex-wrap gap-1">
              <Badge v-for="tag in post.tags" :key="tag.id" variant="secondary">
                {{ tag.name }}
              </Badge>
            </div>
            <span v-else>—</span>
          </TableCell>

          <TableCell>
            <Badge :variant="post.status === 'PUBLISHED' ? 'default' : 'secondary'">
              {{ post.status }}
            </Badge>
          </TableCell>

          <TableCell class="text-right">
            <ButtonGroup class="justify-end w-full">
              <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                  <Button size="icon" variant="outline" :disabled="actionPending === post.id"
                    aria-label="Ações do post">
                    <EllipsisIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @select="navigateTo(`/admin/posts/${post.id}/editar`)">
                    <PencilIcon /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem @select="navigateTo(`/posts/${post.slug}`)">
                    <EyeIcon /> Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem @select="togglePublish(post)">
                    <component :is="post.status === 'PUBLISHED' ? EyeOffIcon : UploadIcon" />
                    {{ post.status === 'PUBLISHED' ? 'Despublicar' : 'Publicar' }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" @select="confirmDeleteTarget = post">
                    <Trash2Icon /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Dialog :open="!!confirmDeleteTarget" @update:open="(open) => { if (!open) confirmDeleteTarget = null }">
      <DialogContent v-if="confirmDeleteTarget">
        <DialogHeader>
          <DialogTitle>Excluir post</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o post <strong>{{ confirmDeleteTarget.title }}</strong>? Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" :disabled="actionPending === confirmDeleteTarget.id" @click="confirmDeleteTarget = null">
            Cancelar
          </Button>
          <Button
            variant="destructive"
            class="bg-destructive text-white hover:bg-destructive/90"
            :disabled="actionPending === confirmDeleteTarget.id"
            @click="confirmDelete"
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
