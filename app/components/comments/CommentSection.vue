<script setup lang="ts">
import type { Comment, CommentTargetRef } from '#shared/types/comment'
import { COMMENT_MAX_LENGTH } from '#shared/utils/comment'
import ErrorState from '@/components/common/ErrorState.vue'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CheckIcon, LinkIcon, MessageCircleCheckIcon, MessageCircleIcon, MessagesSquareIcon, PanelTopCloseIcon, PanelTopOpenIcon } from '@lucide/vue'

// Seção de comentários reutilizável: serve para qualquer alvo comentável
// (post, projeto/componente). As regras — alvo publicado, moderação,
// tamanho — ficam no servidor (CommentService); aqui é só a interface.
const props = defineProps<{
  target: CommentTargetRef
}>()

const { user } = useAuth()

// Volta para a página atual depois do login com Google.
const route = useRoute()
const loginUrl = computed(() => `/login?redirect=${encodeURIComponent(route.fullPath)}`)

const QUERY = `
  query TargetComments($target: CommentTargetInput!) {
    comments(target: $target) {
      id content createdAt
      user { name }
      replies {
        id content createdAt
        user { name }
      }
    }
  }
`

const { data, error } = await useAsyncData(`comments-${props.target.type}-${props.target.id}`, () =>
  useGraphQL<{ comments: Comment[] }>(QUERY, { target: { type: props.target.type, id: props.target.id } })
)

const CREATE_MUTATION = `mutation ($input: CreateCommentInput!) { createComment(input: $input) { id } }`

// Erro do envio (validação, limite de envios, alvo indisponível) — a
// mensagem vem do servidor, que é quem valida.
const submitError = ref<string | null>(null)

async function createComment(content: string, parentId?: string) {
  submitError.value = null
  try {
    await useGraphQL(CREATE_MUTATION, {
      input: { target: { type: props.target.type, id: props.target.id }, content, parentId }
    })
    justSubmitted.value = true
    return true
  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'Não foi possível enviar o comentário.'
    return false
  }
}

const newCommentContent = ref('')
const submitting = ref(false)
const justSubmitted = ref(false)

async function submitComment() {
  if (!newCommentContent.value.trim()) return
  submitting.value = true
  try {
    if (await createComment(newCommentContent.value)) {
      newCommentContent.value = ''
    }
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
  submitError.value = null
}

async function submitReply(parentId: string) {
  if (!replyContent.value.trim()) return
  replySubmitting.value = true
  try {
    if (await createComment(replyContent.value, parentId)) {
      replyingToId.value = null
    }
  } finally {
    replySubmitting.value = false
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Respostas começam escondidas — só expandem quando o leitor pede.
const expandedReplies = ref(new Set<string>())

function toggleReplies(commentId: string) {
  const next = new Set(expandedReplies.value)
  if (next.has(commentId)) {
    next.delete(commentId)
  } else {
    next.add(commentId)
  }
  expandedReplies.value = next
}

// "Copiar link" em cada comentário copia a URL da página (sem query string),
// para compartilhar a conversa. Guarda qual comentário mostra o "copiado".
const copiedId = ref<string | null>(null)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

async function copyPageLink(commentId: string) {
  try {
    await navigator.clipboard.writeText(`${window.location.origin}${route.path}`)
  } catch {
    return
  }
  copiedId.value = commentId
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copiedId.value = null), 2000)
}

// Comentários sempre começam fechados; abrir vale só para esta página.
const open = ref(false)
const bodyId = useId()

function toggleOpen() {
  open.value = !open.value
}
</script>

<template>
  <section class="flex min-h-0 flex-col gap-4">
    <!-- Ações do conteúdo (curtir, compartilhar…) vêm da página pelo slot;
         abrir/fechar fecha a linha. -->
    <div class="flex shrink-0 flex-wrap gap-3">
      <slot name="actions" />
      <Button size="lg" variant="outline" :aria-expanded="open" :aria-controls="bodyId" @click="toggleOpen">
        <component :is="open ? PanelTopCloseIcon : PanelTopOpenIcon" class="size-4" />
        {{ open ? 'Fechar' : 'Abrir' }}
      </Button>
    </div>

    <h2 class="flex shrink-0 items-center gap-2 text-xl font-medium">
      <MessageCircleIcon class="size-5" />
      Comentários ({{ data?.comments.length ?? 0 }})
    </h2>

    <!-- v-show (não v-if): os comentários continuam no HTML do SSR e o
         rascunho digitado não se perde ao fechar. -->
    <div v-show="open" :id="bodyId" class="flex min-h-0 flex-1 flex-col gap-6">
      <!-- Admin só responde comentários existentes, não abre comentário novo. -->
      <div v-if="user && user.role !== 'ADMIN'" class="flex shrink-0 flex-col gap-2">
        <Textarea v-model="newCommentContent" rows="3" :maxlength="COMMENT_MAX_LENGTH"
          placeholder="Escreva um comentário…" aria-label="Comentário" />
        <Button size="lg" class="self-start" :disabled="submitting || !newCommentContent.trim()" @click="submitComment">
          {{ submitting ? 'Enviando…' : 'Comentar' }}
        </Button>
        <p v-if="justSubmitted" class="text-sm text-muted-foreground">
          Comentário enviado — aparece publicamente após aprovação de um administrador.
        </p>
      </div>
      <div v-else-if="!user" class="shrink-0 text-sm text-muted-foreground flex flex-col gap-2">
        <p>
          <NuxtLink :to="loginUrl" class="underline">Faça login</NuxtLink> e participe! Se você já trabalhou comigo em
          algum
          projeto, gostou de um componente ou se interessou por algum assunto do blog, deixe seu comentário.
        </p>
        <p>Sua participação ajuda a trocar experiências e incentiva outras pessoas a compartilhar suas ideias.</p>
      </div>

      <p v-if="submitError" role="alert" class="shrink-0 text-sm text-destructive">
        {{ submitError }}
      </p>

      <ErrorState v-if="error" message="Não foi possível carregar os comentários." />
      <p v-else-if="!data?.comments.length" class="text-sm text-muted-foreground">
        Nenhum comentário ainda.
      </p>

      <ul v-else class="scrollbar-elegant flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pr-1">
        <li v-for="comment in data.comments" :key="comment.id" class="flex flex-col gap-2">
          <div class="flex flex-col items-baseline text-sm">
            <span class="font-medium">{{ comment.user.name }}</span>
            <span class="text-muted-foreground">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <p class="text-sm">
            {{ comment.content }}
          </p>
          <div class="flex items-center gap-4">
            <button v-if="user" type="button"
              class="flex items-center gap-1 text-xs text-muted-foreground hover:underline"
              @click="startReply(comment.id)">
              <MessagesSquareIcon class="size-3.5" />
              Responder
            </button>

            <button v-if="comment.replies.length" type="button"
              class="flex items-center gap-1 text-xs text-muted-foreground hover:underline"
              @click="toggleReplies(comment.id)">
              <MessageCircleCheckIcon class="size-3.5" />
              {{ expandedReplies.has(comment.id) ? 'Ocultar respostas' : 'Mostrar respostas' }} ({{
                comment.replies.length
              }})
            </button>

            <button type="button" class="flex items-center gap-1 text-xs text-muted-foreground hover:underline"
              @click="copyPageLink(comment.id)">
              <component :is="copiedId === comment.id ? CheckIcon : LinkIcon" class="size-3.5" />
              {{ copiedId === comment.id ? 'Copiado!' : 'Copiar' }}
            </button>
          </div>

          <div v-if="replyingToId === comment.id" class="flex flex-col gap-2">
            <Textarea v-model="replyContent" rows="2" :maxlength="COMMENT_MAX_LENGTH"
              placeholder="Escreva uma resposta…" aria-label="Resposta" />
            <div class="flex gap-2">
              <Button size="lg" :disabled="replySubmitting || !replyContent.trim()" @click="submitReply(comment.id)">
                {{ replySubmitting ? 'Enviando…' : 'Responder' }}
              </Button>
              <Button size="lg" variant="outline" @click="replyingToId = null">
                Cancelar
              </Button>
            </div>
          </div>

          <ul v-if="comment.replies.length && expandedReplies.has(comment.id)"
            class="ml-4 flex flex-col gap-4 border-l pl-4">
            <li v-for="reply in comment.replies" :key="reply.id" class="flex flex-col">
              <span class="text-sm font-medium">{{ reply.user.name }}</span>
              <span class="text-xs text-muted-foreground">{{ formatDate(reply.createdAt) }}</span>
              <p class="mt-2 text-sm text-muted-foreground">
                {{ reply.content }}
              </p>
              <button type="button"
                class="mt-2 flex items-center gap-1 self-start text-xs text-muted-foreground hover:underline"
                @click="copyPageLink(reply.id)">
                <component :is="copiedId === reply.id ? CheckIcon : LinkIcon" class="size-3.5" />
                {{ copiedId === reply.id ? 'Copiado!' : 'Copiar' }}
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>
