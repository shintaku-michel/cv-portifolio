<script setup lang="ts">
import { BookOpenTextIcon } from '@lucide/vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
      author { name avatarUrl bio }
      category { id name }
      tags { id name }
    }
  }
`

const { data, error } = await useAsyncData(`post-${slug}`, () =>
  useGraphQL<{ post: Post | null }>(QUERY, { slug })
)

if (error.value) {
  throw createError({ statusCode: 500, statusMessage: 'Não foi possível carregar o post' })
}
if (!data.value?.post) {
  throw createError({ statusCode: 404, statusMessage: 'Post não encontrado' })
}

const post = computed(() => data.value!.post!)

const authorInitials = computed(() =>
  post.value.author.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]!.toUpperCase())
    .join('')
)

const requestUrl = useRequestURL()
const postUrl = computed(() => `${requestUrl.origin}/posts/${post.value.slug}`)

useSeoMeta({
  title: post.value.title,
  description: post.value.excerpt,
  ogType: 'article',
  ogTitle: post.value.title,
  ogDescription: post.value.excerpt,
  ogImage: post.value.coverImage ?? undefined,
  ogUrl: postUrl.value,
  twitterCard: 'summary_large_image',
  twitterTitle: post.value.title,
  twitterDescription: post.value.excerpt,
  twitterImage: post.value.coverImage ?? undefined
})

useHead({
  link: [{ rel: 'canonical', href: postUrl.value }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.value.title,
      description: post.value.excerpt,
      image: post.value.coverImage ?? undefined,
      datePublished: post.value.publishedAt ?? undefined,
      author: { '@type': 'Person', name: post.value.author.name },
      mainEntityOfPage: postUrl.value
    })
  }]
})

const renderedContent = computed(() => renderMarkdown(post.value.content))

function formatDate(value: string | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <article class="mx-auto max-w-6xl px-4 py-12">
    <NuxtLink to="/posts" class="mb-6 inline-block text-sm text-muted-foreground hover:underline">
      ← Voltar para o blog
    </NuxtLink>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_1fr] lg:gap-12">
      <div class="min-w-0">
        <div class="mb-4 flex items-center gap-3">
          <Avatar>
            <AvatarImage v-if="post.author.avatarUrl" :src="post.author.avatarUrl" :alt="post.author.name" />
            <AvatarFallback>{{ authorInitials }}</AvatarFallback>
          </Avatar>
          <div class="min-w-0">
            <p class="font-medium leading-tight">
              {{ post.author.name }}
            </p>
            <p v-if="post.author.bio" class="truncate text-sm leading-tight text-muted-foreground">
              {{ post.author.bio }}
            </p>
          </div>
        </div>

        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span v-if="post.publishedAt">{{ formatDate(post.publishedAt) }}</span>
            <Badge v-if="post.category" variant="outline">
              {{ post.category.name }}
            </Badge>
            <Badge v-for="tag in post.tags" :key="tag.id" variant="secondary">
              {{ tag.name }}
            </Badge>
          </div>

          <Button variant="ghost" size="sm" class="gap-2 text-muted-foreground">
            <BookOpenTextIcon class="size-4" />
            Leitor imersivo
          </Button>
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
      </div>

      <div class="flex flex-col gap-6 rounded-lg border p-6 lg:sticky lg:top-6 lg:h-[calc(100vh-12rem)] lg:self-start">
        <div class="flex shrink-0 gap-3">
          <LikeButton :post-id="post.id" :liked="post.likedByMe" :count="post.likesCount" />
          <ShareButton :url="postUrl" />
        </div>

        <CommentSection :post-id="post.id" class="min-h-0 flex-1" />
      </div>
    </div>
  </article>
</template>
