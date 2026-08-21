<script setup lang="ts">
import type { Project } from '#shared/types/project'
import { EllipsisIcon, EyeIcon, EyeOffIcon, PencilIcon, Trash2Icon, UploadIcon } from '@lucide/vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin · Projetos' })

const QUERY = `
  query AdminProjects {
    projects {
      id title slug status featured displayOrder createdAt
      technologies { id name }
    }
  }
`

const { data, pending, error, refresh } = await useAsyncData('admin-projetos', () =>
  useGraphQL<{ projects: Project[] }>(QUERY)
)

const actionPending = ref<string | null>(null)

async function togglePublish(project: Project) {
  actionPending.value = project.id
  const mutation = project.status === 'PUBLISHED'
    ? `mutation ($id: ID!) { unpublishProject(id: $id) { id } }`
    : `mutation ($id: ID!) { publishProject(id: $id) { id } }`
  try {
    await useGraphQL(mutation, { id: project.id })
    await refresh()
  } finally {
    actionPending.value = null
  }
}

async function remove(project: Project) {
  if (!confirm(`Excluir o projeto "${project.title}"? Essa ação não pode ser desfeita.`)) {
    return
  }
  actionPending.value = project.id
  try {
    await useGraphQL(`mutation ($id: ID!) { deleteProject(id: $id) }`, { id: project.id })
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
        Projetos
      </h1>
      <NuxtLink to="/admin/projetos/novo">
        <Button>Novo projeto</Button>
      </NuxtLink>
    </div>

    <LoadingState v-if="pending" />
    <ErrorState v-else-if="error" message="Não foi possível carregar os projetos." />
    <EmptyState v-else-if="!data?.projects.length" message="Nenhum projeto cadastrado ainda." />

    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Destaque</TableHead>
          <TableHead>Tecnologias</TableHead>
          <TableHead>Ordem</TableHead>
          <TableHead class="text-right">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="project in data?.projects ?? []" :key="project.id">
          <TableCell class="font-medium">
            {{ project.title }}
          </TableCell>
          <TableCell>
            <Badge :variant="project.status === 'PUBLISHED' ? 'default' : 'secondary'">
              {{ project.status }}
            </Badge>
          </TableCell>
          <TableCell>{{ project.featured ? 'Sim' : 'Não' }}</TableCell>
          <TableCell>{{ project.technologies.map(t => t.name).join(', ') }}</TableCell>
          <TableCell>{{ project.displayOrder }}</TableCell>
          <TableCell class="text-right">
            <ButtonGroup class="justify-end">
              <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                  <Button size="icon" variant="outline" :disabled="actionPending === project.id" aria-label="Ações do projeto">
                    <EllipsisIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @select="navigateTo(`/admin/projetos/${project.id}/editar`)">
                    <PencilIcon /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem @select="navigateTo(`/projetos/${project.slug}`)">
                    <EyeIcon /> Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem @select="togglePublish(project)">
                    <component :is="project.status === 'PUBLISHED' ? EyeOffIcon : UploadIcon" />
                    {{ project.status === 'PUBLISHED' ? 'Despublicar' : 'Publicar' }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" @select="remove(project)">
                    <Trash2Icon /> Excluir
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
