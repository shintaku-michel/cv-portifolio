<script setup lang="ts">
import { HeartIcon, MessageCircleIcon } from '@lucide/vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import type { Post } from '#shared/types/post'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Blog',
  description: 'Artigos técnicos, tutoriais e relatos de projetos.',
  ogTitle: 'Blog',
  ogUrl: `${requestUrl.origin}/posts`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/posts` }] })

const QUERY = `
  query PublicPosts {
    posts {
      id title slug excerpt coverImage publishedAt likesCount commentsCount
      author { name avatarUrl bio }
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

function authorInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]!.toUpperCase())
    .join('')
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

    <LoadingState v-if="pending" />
    <ErrorState v-else-if="error" message="Não foi possível carregar os posts." />
    <EmptyState v-else-if="!data?.posts.length" message="Nenhum post publicado ainda." />

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
          <div class="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarImage v-if="post.author.avatarUrl" :src="post.author.avatarUrl" :alt="post.author.name" />
              <AvatarFallback>{{ authorInitials(post.author.name) }}</AvatarFallback>
            </Avatar>
            <div class="min-w-0">
              <p class="truncate text-sm font-medium leading-tight">
                {{ post.author.name }}
              </p>
              <p v-if="post.author.bio" class="truncate text-xs leading-tight text-muted-foreground">
                {{ post.author.bio }}
              </p>
            </div>
          </div>

          <h2 class="text-lg font-medium">
            {{ post.title }}
          </h2>
          <p class="text-sm text-muted-foreground">
            {{ post.excerpt }}
          </p>

          <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span v-if="post.publishedAt">{{ formatDate(post.publishedAt) }}</span>
            <Badge v-if="post.category" variant="outline">
              {{ post.category.name }}
            </Badge>
            <Badge v-for="tag in post.tags" :key="tag.id" variant="secondary">
              {{ tag.name }}
            </Badge>

            <span class="ml-auto flex items-center gap-3">
              <span class="flex items-center gap-1">
                <HeartIcon class="size-3.5" />
                {{ post.likesCount }}
              </span>
              <span class="flex items-center gap-1">
                <MessageCircleIcon class="size-3.5" />
                {{ post.commentsCount }}
              </span>
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
