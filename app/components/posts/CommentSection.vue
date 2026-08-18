<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Comment } from '#shared/types/comment'

const props = defineProps<{
  postId: string
}>()

const { user } = useAuth()

const QUERY = `
  query PostComments($postId: ID!) {
    comments(postId: $postId) {
      id content createdAt
      user { name }
      replies {
        id content createdAt
        user { name }
      }
    }
  }
`

const { data } = await useAsyncData(`comments-${props.postId}`, () =>
  useGraphQL<{ comments: Comment[] }>(QUERY, { postId: props.postId })
)

const newCommentContent = ref('')
const submitting = ref(false)
const justSubmitted = ref(false)

async function submitComment() {
  if (!newCommentContent.value.trim()) return
  submitting.value = true
  try {
    await useGraphQL(
      `mutation ($input: CreateCommentInput!) { createComment(input: $input) { id } }`,
      { input: { postId: props.postId, content: newCommentContent.value } }
    )
    newCommentContent.value = ''
    justSubmitted.value = true
  } finally {
    submitting.value = false
  }
}

const replyingToId = ref<string | null>(null)
const replyContent = ref('')
const replySubmitting = ref(false)

function startReply(commentId: string) {
  replyingToId.value = commentId
  replyContent.value = ''
}

async function submitReply(parentId: string) {
  if (!replyContent.value.trim()) return
  replySubmitting.value = true
  try {
    await useGraphQL(
      `mutation ($input: CreateCommentInput!) { createComment(input: $input) { id } }`,
      { input: { postId: props.postId, content: replyContent.value, parentId } }
    )
    replyingToId.value = null
    justSubmitted.value = true
  } finally {
    replySubmitting.value = false
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <section class="flex flex-col gap-6">
    <h2 class="text-xl font-medium">
      Comentários ({{ data?.comments.length ?? 0 }})
    </h2>

    <div v-if="user" class="flex flex-col gap-2">
      <Textarea v-model="newCommentContent" rows="3" placeholder="Escreva um comentário…" />
      <Button class="self-start" :disabled="submitting || !newCommentContent.trim()" @click="submitComment">
        {{ submitting ? 'Enviando…' : 'Comentar' }}
      </Button>
      <p v-if="justSubmitted" class="text-sm text-muted-foreground">
        Comentário enviado — aparece publicamente após aprovação de um administrador.
      </p>
    </div>
    <p v-else class="text-sm text-muted-foreground">
      <NuxtLink to="/login" class="underline">Faça login</NuxtLink> para comentar.
    </p>

    <p v-if="!data?.comments.length" class="text-sm text-muted-foreground">
      Nenhum comentário ainda.
    </p>

    <ul v-else class="flex flex-col gap-6">
      <li v-for="comment in data.comments" :key="comment.id" class="flex flex-col gap-2">
        <div class="flex items-baseline gap-2 text-sm">
          <span class="font-medium">{{ comment.user.name }}</span>
          <span class="text-muted-foreground">{{ formatDate(comment.createdAt) }}</span>
        </div>
        <p class="text-sm">
          {{ comment.content }}
        </p>
        <button
          v-if="user"
          type="button"
          class="self-start text-xs text-muted-foreground hover:underline"
          @click="startReply(comment.id)"
        >
          Responder
        </button>

        <div v-if="replyingToId === comment.id" class="ml-4 flex flex-col gap-2">
          <Textarea v-model="replyContent" rows="2" placeholder="Escreva uma resposta…" />
          <div class="flex gap-2">
            <Button size="sm" :disabled="replySubmitting || !replyContent.trim()" @click="submitReply(comment.id)">
              {{ replySubmitting ? 'Enviando…' : 'Responder' }}
            </Button>
            <Button size="sm" variant="outline" @click="replyingToId = null">
              Cancelar
            </Button>
          </div>
        </div>

        <ul v-if="comment.replies.length" class="ml-4 flex flex-col gap-4 border-l pl-4">
          <li v-for="reply in comment.replies" :key="reply.id" class="flex flex-col gap-2">
            <div class="flex items-baseline gap-2 text-sm">
              <span class="font-medium">{{ reply.user.name }}</span>
              <span class="text-muted-foreground">{{ formatDate(reply.createdAt) }}</span>
            </div>
            <p class="text-sm">
              {{ reply.content }}
            </p>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>
