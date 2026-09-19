<script setup lang="ts">
import TechIcon from '@/components/common/TechIcon.vue'

defineProps<{ name: string, slug?: string }>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:text-foreground">
    <TechIcon v-if="slug" :slug="slug" />
    {{ name }}
  </span>
</template>
