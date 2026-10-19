<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { LinkIcon } from '@lucide/vue';

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
  <Button size="lg" variant="outline" @click="copyLink">
    <LinkIcon class="size-4" />
    {{ copied ? 'Link copiado!' : 'Copiar link' }}
  </Button>
</template>
