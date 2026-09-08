<script setup lang="ts">
import type { Certificate, CertificateCategory } from '#shared/types/certificate'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EllipsisIcon, PencilIcon, Trash2Icon } from '@lucide/vue'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin · Certificados' })

const CATEGORY_LABELS: Record<CertificateCategory, string> = {
  DESENVOLVIMENTO_WEB: 'Desenvolvimento Web',
  UX_UI_DESIGN: 'UX/UI Design',
  DEVOPS: 'DevOps',
  BACKEND: 'Backend',
  GESTAO_DE_PROJETOS: 'Gestão de Projetos'
}

const QUERY = `
  query AdminCertificates {
    certificates {
      id title category completedAt displayOrder onlineUrl
    }
  }
`

const { data, pending, error, refresh } = await useAsyncData('admin-certificados', () =>
  useGraphQL<{ certificates: Certificate[] }>(QUERY)
)

const actionPending = ref<string | null>(null)
const confirmDeleteTarget = ref<Certificate | null>(null)

async function confirmDelete() {
  const target = confirmDeleteTarget.value
  if (!target) return

  actionPending.value = target.id
  try {
    await useGraphQL(`mutation ($id: ID!) { deleteCertificate(id: $id) }`, { id: target.id })
    await refresh()
    confirmDeleteTarget.value = null
  } finally {
    actionPending.value = null
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl py-8">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-semibold">
        Certificados
      </h1>
      <NuxtLink to="/admin/certificados/novo">
        <Button>Novo certificado</Button>
      </NuxtLink>
    </div>

    <LoadingState v-if="pending" />
    <ErrorState v-else-if="error" message="Não foi possível carregar os certificados." />
    <EmptyState v-else-if="!data?.certificates.length" message="Nenhum certificado cadastrado ainda." />

    <Table v-else class="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead class="w-[35%]">
            Título
          </TableHead>
          <TableHead class="w-[25%]">
            Categoria
          </TableHead>
          <TableHead class="w-[15%]">
            Concluído em
          </TableHead>
          <TableHead class="w-[10%]">
            Ordem
          </TableHead>
          <TableHead class="w-[15%] text-right">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="certificate in data?.certificates ?? []" :key="certificate.id">
          <TableCell class="font-medium whitespace-normal wrap-break-word">
            {{ certificate.title }}
          </TableCell>
          <TableCell>{{ CATEGORY_LABELS[certificate.category] }}</TableCell>
          <TableCell>{{ certificate.completedAt }}</TableCell>
          <TableCell>{{ certificate.displayOrder }}</TableCell>
          <TableCell class="text-right">
            <ButtonGroup class="justify-end w-full">
              <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                  <Button size="icon" variant="outline" :disabled="actionPending === certificate.id"
                    aria-label="Ações do certificado">
                    <EllipsisIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @select="navigateTo(`/admin/certificados/${certificate.id}/editar`)">
                    <PencilIcon /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" @select="confirmDeleteTarget = certificate">
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
          <DialogTitle>Excluir certificado</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o certificado <strong>{{ confirmDeleteTarget.title }}</strong>? Essa ação não pode ser desfeita.
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
