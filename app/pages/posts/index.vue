<script setup lang="ts">
import type { Post } from '#shared/types/post'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import PostCard from '@/components/posts/PostCard.vue'
import { MoveLeft } from '@lucide/vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Posts',
  description: 'Todos os artigos técnicos, tutoriais e relatos de projetos do blog.',
  ogTitle: 'Posts — Blog',
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
</script>

<template>
  <div class="md:p-6 md:mx-auto md:w-3xl">
    <NuxtLink to="/blog" class="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:underline">
      <MoveLeft class="h-4 w-4" />
      Blog
    </NuxtLink>

    <div class="mb-2 flex flex-col items-start gap-2">
      <h1 class="text-2xl font-semibold">
        Posts
      </h1>
      <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground mt-1">
        Tecnologia, artigos técnicos, tutoriais e relatos de projetos
      </p>
    </div>

    <LoadingState v-if="pending" />
    <ErrorState v-else-if="error" message="Não foi possível carregar os posts." />
    <EmptyState v-else-if="!data?.posts.length" message="Nenhum post publicado ainda." />

    <div v-else class="flex flex-col gap-6 mt-6">
      <PostCard v-for="post in data.posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>
