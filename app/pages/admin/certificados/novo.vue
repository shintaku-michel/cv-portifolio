<script setup lang="ts">
import type { CertificateInput } from '#shared/types/certificate'
import CertificateForm from '@/components/admin/CertificateForm.vue'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin · Novo certificado' })

const submitting = ref(false)
const errorMessage = ref<string | null>(null)

const MUTATION = `
  mutation ($input: CreateCertificateInput!) {
    createCertificate(input: $input) { id }
  }
`

async function onSubmit(input: CertificateInput) {
  submitting.value = true
  errorMessage.value = null
  try {
    const result = await useGraphQL<{ createCertificate: { id: string } }>(MUTATION, { input })
    await navigateTo(`/admin/certificados/${result.createCertificate.id}/editar`)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Erro ao criar certificado'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="mb-6 text-2xl font-semibold">
      Novo certificado
    </h1>
    <p v-if="errorMessage" role="alert" class="mb-4 text-sm text-destructive">
      {{ errorMessage }}
    </p>
    <CertificateForm :submitting="submitting" @submit="onSubmit" />
  </div>
</template>
