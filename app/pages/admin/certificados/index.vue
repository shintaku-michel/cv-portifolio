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
import { EllipsisIcon, GripHorizontalIcon, PencilIcon, Trash2Icon } from '@lucide/vue'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin · Certificados' })

const CATEGORY_LABELS: Record<CertificateCategory, string> = {
  DESENVOLVIMENTO_WEB: 'Desenvolvimento Web',
  UX_UI_DESIGN: 'UX/UI Design',
  DEVOPS: 'DevOps',
  BACKEND: 'Backend',
  GESTAO_DE_PROJETOS: 'Gestão de Projetos'
}

function formatDate(value: string) {
  return value.replaceAll('-', '/')
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

// Cópia local reordenável: refletir o drag imediatamente na UI sem esperar
// a mutação, e ressincronizar sempre que `data` mudar (refresh, etc).
const certificateList = ref<Certificate[]>([])
watch(() => data.value?.certificates, (list) => { certificateList.value = list ? [...list] : [] }, { immediate: true })

const draggingId = ref<string | null>(null)
const reordering = ref(false)

function onDragStart(certificate: Certificate, event: DragEvent) {
  draggingId.value = certificate.id
  event.dataTransfer?.setData('text/plain', certificate.id)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function onDragEnd() {
  draggingId.value = null
}

async function onDrop(target: Certificate) {
  const sourceId = draggingId.value
  draggingId.value = null
  if (!sourceId || sourceId === target.id) return

  const list = [...certificateList.value]
  const sourceIndex = list.findIndex(c => c.id === sourceId)
  const targetIndex = list.findIndex(c => c.id === target.id)
  if (sourceIndex === -1 || targetIndex === -1) return

  const [moved] = list.splice(sourceIndex, 1)
  list.splice(targetIndex, 0, moved!)
  certificateList.value = list

  const changes = list
    .map((certificate, index) => ({ id: certificate.id, displayOrder: index }))
    .filter(({ id, displayOrder }) => list.find(c => c.id === id)!.displayOrder !== displayOrder)

  if (!changes.length) return

  reordering.value = true
  try {
    await Promise.all(changes.map(({ id, displayOrder }) =>
      useGraphQL(
        `mutation ($id: ID!, $input: UpdateCertificateInput!) { updateCertificate(id: $id, input: $input) { id displayOrder } }`,
        { id, input: { displayOrder } }
      )
    ))
    await refresh()
  } finally {
    reordering.value = false
  }
}

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
  <div class="mx-auto max-w-5xl py-8 px-4">
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

    <template v-else>
      <!-- Mobile: um cartão por certificado em vez de tabela larga. -->
      <div class="flex flex-col gap-3 sm:hidden">
        <div v-for="certificate in certificateList" :key="certificate.id" class="rounded-lg border p-4"
          :class="{ 'opacity-50': draggingId === certificate.id }" @dragover.prevent @drop="onDrop(certificate)">
          <div class="mb-3 flex items-start justify-between gap-2">
            <p class="font-medium wrap-break-word">
              {{ certificate.title }}
            </p>
            <div class="flex shrink-0 items-center gap-1">
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
              <Button size="icon" variant="outline" draggable="true" :disabled="reordering"
                aria-label="Arrastar para reordenar" class="cursor-grab active:cursor-grabbing"
                @dragstart="onDragStart(certificate, $event)" @dragend="onDragEnd">
                <GripHorizontalIcon />
              </Button>
            </div>
          </div>
          <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <dt class="text-xs text-muted-foreground">
                Categoria
              </dt>
              <dd>{{ CATEGORY_LABELS[certificate.category] }}</dd>
            </div>
            <div>
              <dt class="text-xs text-muted-foreground">
                Concluído em
              </dt>
              <dd>{{ formatDate(certificate.completedAt) }}</dd>
            </div>
            <div>
              <dt class="text-xs text-muted-foreground">
                Ordem
              </dt>
              <dd>{{ certificate.displayOrder }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- sm+: tabela normal. -->
      <Table class="hidden table-fixed sm:table">
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
          <TableRow v-for="certificate in certificateList" :key="certificate.id"
            :class="{ 'opacity-50': draggingId === certificate.id }" @dragover.prevent @drop="onDrop(certificate)">
            <TableCell class="font-medium whitespace-normal wrap-break-word">
              {{ certificate.title }}
            </TableCell>
            <TableCell>{{ CATEGORY_LABELS[certificate.category] }}</TableCell>
            <TableCell>{{ formatDate(certificate.completedAt) }}</TableCell>
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
                <Button size="icon" variant="outline" draggable="true" :disabled="reordering"
                  aria-label="Arrastar para reordenar" class="cursor-grab active:cursor-grabbing"
                  @dragstart="onDragStart(certificate, $event)" @dragend="onDragEnd">
                  <GripHorizontalIcon />
                </Button>
              </ButtonGroup>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>

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
