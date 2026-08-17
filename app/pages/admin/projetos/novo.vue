<script setup lang="ts">
import ProjectForm from '@/components/admin/ProjectForm.vue'
import type { ProjectInput, Technology } from '#shared/types/project'

definePageMeta({ middleware: 'admin' })
useHead({ title: 'Admin · Novo projeto' })

const { data } = await useAsyncData('admin-projeto-novo-technologies', () =>
  useGraphQL<{ technologies: Technology[] }>(`{ technologies { id name slug } }`)
)

const submitting = ref(false)
const errorMessage = ref<string | null>(null)

const MUTATION = `
  mutation ($input: CreateProjectInput!) {
    createProject(input: $input) { id }
  }
`

async function onSubmit(input: ProjectInput) {
  submitting.value = true
  errorMessage.value = null
  try {
    const result = await useGraphQL<{ createProject: { id: string } }>(MUTATION, { input })
    await navigateTo(`/admin/projetos/${result.createProject.id}/editar`)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Erro ao criar projeto'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="mb-6 text-2xl font-semibold">
      Novo projeto
    </h1>
    <p v-if="errorMessage" role="alert" class="mb-4 text-sm text-destructive">
      {{ errorMessage }}
    </p>
    <ProjectForm :technologies="data?.technologies ?? []" :submitting="submitting" @submit="onSubmit" />
  </div>
</template>
