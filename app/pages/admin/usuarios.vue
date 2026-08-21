<script setup lang="ts">
import type { SessionUser, UserRole } from '#shared/types/auth'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ShieldCheckIcon, ShieldOffIcon } from '@lucide/vue'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin · Usuários' })

const { user: currentUser } = useAuth()

const { data, pending, error, refresh } = await useAsyncData('admin-usuarios', () =>
  useGraphQL<{ users: SessionUser[] }>(`{ users { id name email role } }`)
)

const actionPending = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const confirmTarget = ref<SessionUser | null>(null)

function newRoleFor(targetUser: SessionUser): UserRole {
  return targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN'
}

async function confirmToggleRole() {
  const targetUser = confirmTarget.value
  if (!targetUser) return

  actionPending.value = targetUser.id
  errorMessage.value = null
  try {
    await useGraphQL(
      `mutation ($id: ID!, $role: UserRole!) { updateUserRole(id: $id, role: $role) { id } }`,
      { id: targetUser.id, role: newRoleFor(targetUser) }
    )
    await refresh()
    confirmTarget.value = null
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
          <TableHead>Tipo de perfil</TableHead>
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
            <Button
              size="sm"
              variant="outline"
              :disabled="actionPending === u.id || (u.id === currentUser?.id && u.role === 'ADMIN')"
              :title="u.id === currentUser?.id && u.role === 'ADMIN' ? 'Você não pode remover a própria permissão de administrador' : undefined"
              @click="confirmTarget = u"
            >
              <component :is="u.role === 'ADMIN' ? ShieldOffIcon : ShieldCheckIcon" />
              Alterar
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Dialog :open="!!confirmTarget" @update:open="(open) => { if (!open) confirmTarget = null }">
      <DialogContent v-if="confirmTarget">
        <DialogHeader>
          <DialogTitle>Alterar tipo de perfil</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja alterar o perfil de <strong>{{ confirmTarget.name }}</strong> de
            <strong>{{ confirmTarget.role }}</strong> para <strong>{{ newRoleFor(confirmTarget) }}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" :disabled="actionPending === confirmTarget.id" @click="confirmTarget = null">
            Cancelar
          </Button>
          <Button :disabled="actionPending === confirmTarget.id" @click="confirmToggleRole">
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
