<script setup lang="ts">
import type { Certificate, CertificateInput } from '#shared/types/certificate'
import CertificateForm from '@/components/admin/CertificateForm.vue'

definePageMeta({ middleware: 'admin', layout: 'admin' })

const route = useRoute()
const id = route.params.id as string

const QUERY = `
  query AdminCertificateEdit($id: ID!) {
    certificateById(id: $id) {
      id title description category completedAt image onlineUrl displayOrder
    }
  }
`

const { data, error, refresh } = await useAsyncData(`admin-certificado-${id}`, () =>
  useGraphQL<{ certificateById: Certificate | null }>(QUERY, { id })
)

if (error.value) {
  throw createError({ statusCode: 500, statusMessage: 'Não foi possível carregar o certificado' })
}
if (!data.value?.certificateById) {
  throw createError({ statusCode: 404, statusMessage: 'Certificado não encontrado' })
}

const certificate = computed(() => data.value!.certificateById!)

useHead({ title: `Admin · Editar ${certificate.value.title}` })

const submitting = ref(false)
const errorMessage = ref<string | null>(null)

async function onSubmit(input: CertificateInput) {
  submitting.value = true
  errorMessage.value = null
  const MUTATION = `
    mutation ($id: ID!, $input: UpdateCertificateInput!) {
      updateCertificate(id: $id, input: $input) { id }
    }
  `
  try {
    await useGraphQL(MUTATION, { id, input })
    await refresh()
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Erro ao salvar certificado'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="mb-6 text-2xl font-semibold">
      Editar certificado
    </h1>
    <p v-if="errorMessage" role="alert" class="mb-4 text-sm text-destructive">
      {{ errorMessage }}
    </p>
    <CertificateForm :initial-certificate="certificate" :submitting="submitting" @submit="onSubmit" />
  </div>
</template>
