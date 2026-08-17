<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import type { Post } from '#shared/types/post'

useHead({ title: 'Blog' })

const QUERY = `
  query PublicPosts {
    posts {
      id title slug excerpt coverImage publishedAt
      category { id name }
      tags { id name }
    }
  }
`

const { data, pending, error } = await useAsyncData('posts', () =>
  useGraphQL<{ posts: Post[] }>(QUERY)
)

function formatDate(value: string | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="mb-2 text-3xl font-semibold">
      Blog
    </h1>
    <p class="mb-8 text-muted-foreground">
      Artigos técnicos, tutoriais e relatos de projetos.
    </p>

    <div v-if="pending">
      Carregando…
    </div>
    <div v-else-if="error" role="alert" class="text-destructive">
      Não foi possível carregar os posts.
    </div>
    <p v-else-if="!data?.posts.length" class="text-muted-foreground">
      Nenhum post publicado ainda.
    </p>

    <div v-else class="flex flex-col gap-6">
      <NuxtLink
        v-for="post in data.posts"
        :key="post.id"
        :to="`/posts/${post.slug}`"
        class="flex flex-col gap-3 rounded-lg border p-5 transition-colors hover:bg-accent sm:flex-row"
      >
        <img
          v-if="post.coverImage"
          :src="post.coverImage"
          :alt="post.title"
          class="aspect-video w-full rounded-md object-cover sm:w-48 sm:shrink-0"
        >
        <div class="flex flex-col gap-2">
          <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span v-if="post.publishedAt">{{ formatDate(post.publishedAt) }}</span>
            <Badge v-if="post.category" variant="outline">
              {{ post.category.name }}
            </Badge>
          </div>
          <h2 class="text-lg font-medium">
            {{ post.title }}
          </h2>
          <p class="text-sm text-muted-foreground">
            {{ post.excerpt }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
