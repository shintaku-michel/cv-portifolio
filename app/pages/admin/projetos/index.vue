<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Project } from '#shared/types/project'

definePageMeta({ middleware: 'admin' })
useHead({ title: 'Admin · Projetos' })

const QUERY = `
  query AdminProjects {
    projects {
      id title slug status featured displayOrder createdAt
      technologies { id name }
    }
  }
`

const { data, refresh } = await useAsyncData('admin-projetos', () =>
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

    <Table>
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
          <TableCell class="flex flex-wrap justify-end gap-2">
            <NuxtLink :to="`/admin/projetos/${project.id}/editar`">
              <Button size="sm" variant="outline">
                Editar
              </Button>
            </NuxtLink>
            <NuxtLink :to="`/projetos/${project.slug}`">
              <Button size="sm" variant="outline">
                Visualizar
              </Button>
            </NuxtLink>
            <Button
              size="sm"
              variant="outline"
              :disabled="actionPending === project.id"
              @click="togglePublish(project)"
            >
              {{ project.status === 'PUBLISHED' ? 'Despublicar' : 'Publicar' }}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              :disabled="actionPending === project.id"
              @click="remove(project)"
            >
              Excluir
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
