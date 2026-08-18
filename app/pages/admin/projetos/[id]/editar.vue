<script setup lang="ts">
import { Button } from '@/components/ui/button'
import ProjectForm from '@/components/admin/ProjectForm.vue'
import type { Project, ProjectInput, Technology } from '#shared/types/project'

definePageMeta({ middleware: 'admin', layout: 'admin' })

const route = useRoute()
const id = route.params.id as string

const QUERY = `
  query AdminProjectEdit($id: ID!) {
    projectById(id: $id) {
      id title slug shortDescription description coverImage gallery status featured
      displayOrder demoUrl repositoryUrl startDate endDate
      technologies { id name slug }
    }
    technologies { id name slug }
  }
`

const { data, refresh } = await useAsyncData(`admin-projeto-${id}`, () =>
  useGraphQL<{ projectById: Project | null, technologies: Technology[] }>(QUERY, { id })
)

if (!data.value?.projectById) {
  throw createError({ statusCode: 404, statusMessage: 'Projeto não encontrado' })
}

const project = computed(() => data.value!.projectById!)

useHead({ title: `Admin · Editar ${project.value.title}` })

const submitting = ref(false)
const errorMessage = ref<string | null>(null)

async function onSubmit(input: ProjectInput) {
  submitting.value = true
  errorMessage.value = null
  const MUTATION = `
    mutation ($id: ID!, $input: UpdateProjectInput!) {
      updateProject(id: $id, input: $input) { id }
    }
  `
  try {
    await useGraphQL(MUTATION, { id, input })
    await refresh()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Erro ao salvar projeto'
  } finally {
    submitting.value = false
  }
}

async function togglePublish() {
  const mutation = project.value.status === 'PUBLISHED'
    ? `mutation ($id: ID!) { unpublishProject(id: $id) { id } }`
    : `mutation ($id: ID!) { publishProject(id: $id) { id } }`
  await useGraphQL(mutation, { id })
  await refresh()
}

async function remove() {
  if (!confirm(`Excluir o projeto "${project.value.title}"? Essa ação não pode ser desfeita.`)) {
    return
  }
  await useGraphQL(`mutation ($id: ID!) { deleteProject(id: $id) }`, { id })
  await navigateTo('/admin/projetos')
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-semibold">
        Editar projeto
      </h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="togglePublish">
          {{ project.status === 'PUBLISHED' ? 'Despublicar' : 'Publicar' }}
        </Button>
        <Button variant="destructive" @click="remove">
          Excluir
        </Button>
      </div>
    </div>
    <p v-if="errorMessage" role="alert" class="mb-4 text-sm text-destructive">
      {{ errorMessage }}
    </p>
    <ProjectForm
      :initial-project="project"
      :technologies="data?.technologies ?? []"
      :submitting="submitting"
      @submit="onSubmit"
    />
  </div>
</template>
