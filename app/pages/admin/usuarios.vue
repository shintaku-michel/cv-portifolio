<script setup lang="ts">
import type { SessionUser, UserRole } from '#shared/types/auth'
import { EllipsisIcon, ShieldCheckIcon, ShieldOffIcon } from '@lucide/vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin · Usuários' })

const { user: currentUser } = useAuth()

const { data, pending, error, refresh } = await useAsyncData('admin-usuarios', () =>
  useGraphQL<{ users: SessionUser[] }>(`{ users { id name email role } }`)
)

const actionPending = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

async function toggleRole(targetUser: SessionUser) {
  const newRole: UserRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN'
  actionPending.value = targetUser.id
  errorMessage.value = null
  try {
    await useGraphQL(
      `mutation ($id: ID!, $role: UserRole!) { updateUserRole(id: $id, role: $role) { id } }`,
      { id: targetUser.id, role: newRole }
    )
    await refresh()
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Erro ao atualizar usuário'
  } finally {
    actionPending.value = null
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-12">
    <h1 class="mb-6 text-2xl font-semibold">
      Usuários
    </h1>
    <p v-if="errorMessage" role="alert" class="mb-4 text-sm text-destructive">
      {{ errorMessage }}
    </p>

    <LoadingState v-if="pending" />
    <ErrorState v-else-if="error" message="Não foi possível carregar os usuários." />

    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead class="text-right">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="u in data?.users ?? []" :key="u.id">
          <TableCell class="font-medium">
            {{ u.name }}
          </TableCell>
          <TableCell>{{ u.email }}</TableCell>
          <TableCell>
            <Badge :variant="u.role === 'ADMIN' ? 'default' : 'secondary'">
              {{ u.role }}
            </Badge>
          </TableCell>
          <TableCell class="text-right">
            <ButtonGroup class="justify-end">
              <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                  <Button
                    size="icon"
                    variant="outline"
                    :disabled="actionPending === u.id || (u.id === currentUser?.id && u.role === 'ADMIN')"
                    :title="u.id === currentUser?.id && u.role === 'ADMIN' ? 'Você não pode remover a própria permissão de administrador' : undefined"
                    aria-label="Ações do usuário"
                  >
                    <EllipsisIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @select="toggleRole(u)">
                    <component :is="u.role === 'ADMIN' ? ShieldOffIcon : ShieldCheckIcon" />
                    {{ u.role === 'ADMIN' ? 'Tornar USER' : 'Tornar ADMIN' }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
