<script setup lang="ts">
import { Heart } from '@lucide/vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  postId: string
  liked: boolean
  count: number
}>()

const { user } = useAuth()

const liked = ref(props.liked)
const count = ref(props.count)
const pending = ref(false)

async function toggle() {
  if (!user.value) {
    await navigateTo('/login')
    return
  }

  pending.value = true
  const mutation = liked.value
    ? `mutation ($postId: ID!) { unlikePost(postId: $postId) { likesCount likedByMe } }`
    : `mutation ($postId: ID!) { likePost(postId: $postId) { likesCount likedByMe } }`

  try {
    const result = await useGraphQL<{ likePost?: { likesCount: number, likedByMe: boolean }, unlikePost?: { likesCount: number, likedByMe: boolean } }>(
      mutation,
      { postId: props.postId }
    )
    const updated = result.likePost ?? result.unlikePost!
    liked.value = updated.likedByMe
    count.value = updated.likesCount
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <Button
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
