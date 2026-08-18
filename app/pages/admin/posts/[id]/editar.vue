<script setup lang="ts">
import { Button } from '@/components/ui/button'
import PostForm from '@/components/admin/PostForm.vue'
import type { Category, Post, PostInput, Tag } from '#shared/types/post'

definePageMeta({ middleware: 'admin', layout: 'admin' })

const route = useRoute()
const id = route.params.id as string

const QUERY = `
  query AdminPostEdit($id: ID!) {
    postById(id: $id) {
      id title slug excerpt content coverImage status
      category { id name }
      tags { id name }
    }
    categories { id name slug }
    tags { id name slug }
  }
`

const { data, refresh } = await useAsyncData(`admin-post-${id}`, () =>
  useGraphQL<{ postById: Post | null, categories: Category[], tags: Tag[] }>(QUERY, { id })
)

if (!data.value?.postById) {
  throw createError({ statusCode: 404, statusMessage: 'Post não encontrado' })
}

const post = computed(() => data.value!.postById!)

useHead({ title: `Admin · Editar ${post.value.title}` })

const submitting = ref(false)
const errorMessage = ref<string | null>(null)

async function onSubmit(input: PostInput) {
  submitting.value = true
  errorMessage.value = null
  const MUTATION = `
    mutation ($id: ID!, $input: UpdatePostInput!) {
      updatePost(id: $id, input: $input) { id }
    }
  `
  try {
    await useGraphQL(MUTATION, { id, input })
    await refresh()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Erro ao salvar post'
  } finally {
    submitting.value = false
  }
}

async function togglePublish() {
  const mutation = post.value.status === 'PUBLISHED'
    ? `mutation ($id: ID!) { unpublishPost(id: $id) { id } }`
    : `mutation ($id: ID!) { publishPost(id: $id) { id } }`
  await useGraphQL(mutation, { id })
  await refresh()
}

async function remove() {
  if (!confirm(`Excluir o post "${post.value.title}"? Essa ação não pode ser desfeita.`)) {
    return
  }
  await useGraphQL(`mutation ($id: ID!) { deletePost(id: $id) }`, { id })
  await navigateTo('/admin/posts')
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-semibold">
        Editar post
      </h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="togglePublish">
          {{ post.status === 'PUBLISHED' ? 'Despublicar' : 'Publicar' }}
        </Button>
        <Button variant="destructive" @click="remove">
          Excluir
        </Button>
      </div>
    </div>
    <p v-if="errorMessage" role="alert" class="mb-4 text-sm text-destructive">
      {{ errorMessage }}
    </p>
    <PostForm
      :initial-post="post"
      :categories="data?.categories ?? []"
      :tags="data?.tags ?? []"
      :submitting="submitting"
      @submit="onSubmit"
    />
  </div>
</template>
