<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { CheckIcon, CopyIcon } from '@lucide/vue';
import type { PlaygroundSourceInfo } from '~~/server/utils/playground-highlight';

const props = defineProps<{
  info: PlaygroundSourceInfo
}>()

const copied = ref(false)

async function copyCode() {
  await navigator.clipboard.writeText(props.info.source)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div class="mb-8 flex flex-col gap-3 mt-8">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-md font-semibold">
        Código do componente
      </h2>
    </div>
    <!-- eslint-disable vue/no-v-html -->
    <div v-once class="overflow-hidden rounded-lg border text-xs [&_pre]:max-h-120 [&_pre]:overflow-auto [&_pre]:p-4"
      v-html="info.html" />
    <!-- eslint-enable vue/no-v-html -->

    <div class="flex justify-end">
      <Button variant="outline" size="sm" @click="copyCode" class="h-10">
        <CheckIcon v-if="copied" class="size-4" />
        <CopyIcon v-else class="size-4" />
        {{ copied ? 'Copiado!' : 'Copiar código' }}
      </Button>
    </div>
  </div>
</template>
