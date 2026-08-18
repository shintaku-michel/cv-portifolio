<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import CommentSection from '@/components/posts/CommentSection.vue'
import LikeButton from '@/components/posts/LikeButton.vue'
import ShareButton from '@/components/posts/ShareButton.vue'
import type { Post } from '#shared/types/post'

const route = useRoute()
const slug = route.params.slug as string

const QUERY = `
  query PostDetail($slug: String!) {
    post(slug: $slug) {
      id title slug excerpt content coverImage publishedAt likesCount likedByMe
      author { name }
      category { id name }
      tags { id name }
    }
  }
`

const { data } = await useAsyncData(`post-${slug}`, () =>
  useGraphQL<{ post: Post | null }>(QUERY, { slug })
)

if (!data.value?.post) {
  throw createError({ statusCode: 404, statusMessage: 'Post não encontrado' })
}

const post = computed(() => data.value!.post!)

const requestUrl = useRequestURL()
const postUrl = computed(() => `${requestUrl.origin}/posts/${post.value.slug}`)

useSeoMeta({
  title: post.value.title,
  description: post.value.excerpt,
  ogTitle: post.value.title,
  ogDescription: post.value.excerpt,
  ogImage: post.value.coverImage ?? undefined,
  ogUrl: postUrl.value,
  twitterCard: 'summary_large_image'
})

const renderedContent = computed(() => renderMarkdown(post.value.content))

function formatDate(value: string | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <article class="mx-auto max-w-2xl px-4 py-12">
    <NuxtLink to="/posts" class="mb-6 inline-block text-sm text-muted-foreground hover:underline">
      ← Voltar para o blog
    </NuxtLink>

    <div class="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <span v-if="post.publishedAt">{{ formatDate(post.publishedAt) }}</span>
      <span>·</span>
      <span>{{ post.author.name }}</span>
      <Badge v-if="post.category" variant="outline">
        {{ post.category.name }}
      </Badge>
    </div>

    <h1 class="mb-6 text-3xl font-semibold">
      {{ post.title }}
    </h1>

    <img
      v-if="post.coverImage"
      :src="post.coverImage"
      :alt="post.title"
      class="mb-8 aspect-video w-full rounded-lg object-cover"
    >

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="prose prose-neutral max-w-none dark:prose-invert" v-html="renderedContent" />

    <div v-if="post.tags.length" class="mt-8 flex flex-wrap gap-2">
      <Badge v-for="tag in post.tags" :key="tag.id" variant="secondary">
        {{ tag.name }}
      </Badge>
    </div>

    <div class="my-8 flex gap-3">
      <LikeButton :post-id="post.id" :liked="post.likedByMe" :count="post.likesCount" />
      <ShareButton :title="post.title" :url="postUrl" />
    </div>

    <CommentSection :post-id="post.id" />
  </article>
</template>
