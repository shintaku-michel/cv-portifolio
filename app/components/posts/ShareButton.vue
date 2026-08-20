<script setup lang="ts">
import { LinkIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  url: string
}>()

const copied = ref(false)

async function copyLink() {
  await navigator.clipboard.writeText(props.url)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <Button variant="outline" @click="copyLink">
    <LinkIcon class="size-4" />
    {{ copied ? 'Link copiado!' : 'Copiar link' }}
  </Button>
</template>
