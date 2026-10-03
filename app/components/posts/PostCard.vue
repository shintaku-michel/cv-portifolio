<script setup lang="ts">
import type { Post } from '#shared/types/post'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { HeartIcon, MessageCircleIcon } from '@lucide/vue'

defineProps<{
  post: Post
}>()

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
  <!-- Mesma superfície dos cards de projetos e certificados (Card do
       shadcn-vue); o link envolve o card inteiro, com anel de foco próprio. -->
  <NuxtLink :to="`/posts/${post.slug}`"
    class="group/post block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
    <Card class="transition-colors group-hover/post:ring-foreground/25">
      <CardContent class="flex flex-col gap-3 sm:flex-row">
        <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title"
          class="aspect-video w-full rounded-sm object-cover sm:w-48 sm:shrink-0">
        <div class="flex flex-col gap-2">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <Avatar size="md">
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

            <p v-if="post.publishedAt" class="text-xs text-muted-foreground">
              {{ formatDate(post.publishedAt) }}
            </p>
          </div>

          <h2 class="text-lg font-medium">
            {{ post.title }}
          </h2>
          <p class="whitespace-pre-line text-sm text-muted-foreground">
            {{ post.excerpt }}
          </p>
        </div>
      </CardContent>

      <CardFooter class="flex-wrap justify-between gap-2 text-xs text-muted-foreground">
        <div class="flex flex-wrap items-center gap-2">
          <Badge v-if="post.category" variant="outline">
            {{ post.category.name }}
          </Badge>
          <Badge v-for="tag in post.tags" :key="tag.id" variant="outline">
            {{ tag.name }}
          </Badge>
        </div>

        <span class="flex items-center gap-3">
          <span class="flex items-center gap-1">
            <HeartIcon class="size-3.5" />
            {{ post.likesCount }}
          </span>
          <span class="flex items-center gap-1">
            <MessageCircleIcon class="size-3.5" />
            {{ post.commentsCount }}
          </span>
        </span>
      </CardFooter>
    </Card>
  </NuxtLink>
</template>
