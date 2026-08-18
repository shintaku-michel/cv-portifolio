<script setup lang="ts">
import { Share } from '@lucide/vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  title: string
  url: string
}>()

const copied = ref(false)

async function share() {
  if (navigator.share) {
    try {
      await navigator.share({ title: props.title, url: props.url })
    } catch {
      // usuário cancelou o compartilhamento — nada a fazer
    }
    return
  }

  await navigator.clipboard.writeText(props.url)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <Button variant="outline" @click="share">
    <Share class="size-4" />
    {{ copied ? 'Link copiado!' : 'Compartilhar' }}
  </Button>
</template>
