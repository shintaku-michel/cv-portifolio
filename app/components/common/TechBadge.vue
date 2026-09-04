<script setup lang="ts">
import { getTechIcon } from '@/utils/tech-icons'

const props = defineProps<{ name: string, slug?: string }>()

const icon = computed(() => (props.slug ? getTechIcon(props.slug) : undefined))

const { theme } = useTheme()

const iconColor = computed(() => {
  const tech = icon.value
  if (!tech?.hex) return undefined
  const hex = theme.value === 'light' && tech.lightHex ? tech.lightHex : tech.hex
  return `#${hex}`
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:text-foreground">
    <svg v-if="icon" viewBox="0 0 24 24" class="size-3.5 shrink-0" :style="{ color: iconColor }" aria-hidden="true">
      <path :d="icon.path" fill="currentColor" />
    </svg>
    {{ name }}
  </span>
</template>
