<script setup lang="ts">
import type { Comment, CommentStatus } from '#shared/types/comment'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckIcon, EllipsisIcon, EyeIcon, EyeOffIcon, Trash2Icon } from '@lucide/vue'

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

const { data, refresh, pending, error } = await useAsyncData(
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

const confirmDeleteTarget = ref<Comment | null>(null)

async function confirmDelete() {
  const target = confirmDeleteTarget.value
  if (!target) return

  actionPending.value = target.id
  try {
    await useGraphQL(`mutation ($id: ID!) { deleteComment(id: $id) }`, { id: target.id })
    await refresh()
    confirmDeleteTarget.value = null
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
      <button v-for="tab in statusTabs" :key="tab.value" type="button" :aria-pressed="activeStatus === tab.value"
        class="rounded-full border px-3 py-1 text-sm transition-colors"
        :class="activeStatus === tab.value ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'"
        @click="activeStatus = tab.value">
        {{ tab.label }}
      </button>
    </div>

    <LoadingState v-if="pending" />
    <ErrorState v-else-if="error" message="Não foi possível carregar os comentários." />
    <EmptyState v-else-if="!data?.adminComments.length" message="Nenhum comentário nesse status." />

    <Table v-else class="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead class="w-[55%]">
            Post/Comentário
          </TableHead>
          <TableHead class="w-[25%]">
            Autor
          </TableHead>
          <TableHead class="w-[20%] text-right">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="comment in data.adminComments" :key="comment.id">
          <TableCell class="whitespace-normal wrap-break-word">
            <p>{{ comment.post.title }}</p>
            <p class="text-sm text-muted-foreground">{{ comment.content }}</p>
          </TableCell>
          <TableCell class="whitespace-normal wrap-break-word">
            <div class="flex flex-col">
              <span>{{ comment.user.name }}</span>
              <span class="text-xs text-muted-foreground">{{ comment.user.email }}</span>
            </div>
          </TableCell>
          <TableCell class="text-right">
            <ButtonGroup class="justify-end w-full">
              <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                  <Button size="icon" variant="outline" :disabled="actionPending === comment.id"
                    aria-label="Ações do comentário">
                    <EllipsisIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @select="navigateTo(`/posts/${comment.post.slug}`)">
                    <EyeIcon /> Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem v-if="comment.status !== 'VISIBLE'" @select="approve(comment)">
                    <CheckIcon /> Aprovar
                  </DropdownMenuItem>
                  <DropdownMenuItem v-if="comment.status !== 'HIDDEN'" @select="hide(comment)">
                    <EyeOffIcon /> Ocultar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" @select="confirmDeleteTarget = comment">
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
          <DialogTitle>Excluir comentário</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o comentário de <strong>{{ confirmDeleteTarget.user.name }}</strong>
            ("{{ confirmDeleteTarget.content }}")? Essa ação não pode ser desfeita.
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
