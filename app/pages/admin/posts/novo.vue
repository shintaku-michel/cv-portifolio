<script setup lang="ts">
import PostForm from '@/components/admin/PostForm.vue'
import type { Category, PostInput, Tag } from '#shared/types/post'

definePageMeta({ middleware: 'admin' })
useHead({ title: 'Admin · Novo post' })

const { data } = await useAsyncData('admin-post-novo-refs', () =>
  useGraphQL<{ categories: Category[], tags: Tag[] }>(`{
    categories { id name slug }
    tags { id name slug }
  }`)
)

const submitting = ref(false)
const errorMessage = ref<string | null>(null)

const MUTATION = `
  mutation ($input: CreatePostInput!) {
    createPost(input: $input) { id }
  }
`

async function onSubmit(input: PostInput) {
  submitting.value = true
  errorMessage.value = null
  try {
    const result = await useGraphQL<{ createPost: { id: string } }>(MUTATION, { input })
    await navigateTo(`/admin/posts/${result.createPost.id}/editar`)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Erro ao criar post'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="mb-6 text-2xl font-semibold">
      Novo post
    </h1>
    <p v-if="errorMessage" role="alert" class="mb-4 text-sm text-destructive">
      {{ errorMessage }}
    </p>
    <PostForm
      :categories="data?.categories ?? []"
      :tags="data?.tags ?? []"
      :submitting="submitting"
      @submit="onSubmit"
    />
  </div>
</template>
