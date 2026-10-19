<script setup lang="ts">
import { Heart } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import type { ContentRef, ContentType } from '#shared/types/content'

// Botão de curtir reutilizável para qualquer conteúdo (post, projeto/componente).
// Quem decide se pode curtir é o servidor (LikeService) — aqui é só a interface.
const props = defineProps<{
  target: ContentRef
  liked: boolean
  count: number
}>()

type LikeState = { likesCount: number, likedByMe: boolean }

// Mutations de cada tipo: [curtir, descurtir, nome do argumento].
const MUTATIONS: Record<ContentType, [string, string, string]> = {
  POST: ['likePost', 'unlikePost', 'postId'],
  PROJECT: ['likeProject', 'unlikeProject', 'projectId']
}

const { user } = useAuth()
const route = useRoute()

const liked = ref(props.liked)
const count = ref(props.count)
const pending = ref(false)

async function toggle() {
  if (!user.value) {
    // Volta para a página atual depois do login com Google.
    await navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }

  const [likeField, unlikeField, idArg] = MUTATIONS[props.target.type]
  const field = liked.value ? unlikeField : likeField

  pending.value = true
  try {
    const result = await useGraphQL<Record<string, LikeState>>(
      `mutation ($id: ID!) { ${field}(${idArg}: $id) { likesCount likedByMe } }`,
      { id: props.target.id }
    )
    const updated = result[field]!
    liked.value = updated.likedByMe
    count.value = updated.likesCount
  } catch {
    // Mantém o estado anterior — o botão continua refletindo o que o servidor tem.
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <Button
    size="lg"
    variant="outline"
    :disabled="pending"
    :aria-pressed="liked"
    :aria-label="`${liked ? 'Descurtir' : 'Curtir'} (${count} ${count === 1 ? 'curtida' : 'curtidas'})`"
    @click="toggle"
  >
    <Heart :class="['size-4', liked ? 'fill-current text-destructive' : '']" />
    {{ count }}
  </Button>
</template>
