<script setup lang="ts">
import { getTechIcon } from '@/utils/tech-icons'

const props = defineProps<{ name: string, slug?: string }>()

const icon = computed(() => (props.slug ? getTechIcon(props.slug) : undefined))

const { theme } = useTheme()

const iconColor = computed(() => {
  const tech = icon.value
  if (!tech?.hex) return undefined
  if (theme.value === 'light' && tech.lightHex) return `#${tech.lightHex}`
  if (theme.value === 'dark' && tech.darkHex) return `#${tech.darkHex}`
  return `#${tech.hex}`
})

// `svg`: markup pronto (múltiplos paths/cor própria da marca), colado como
// veio do arquivo oficial. `path`: ícone de um path só, pintado via
// currentColor — permite recolorir conforme o tema (ver iconColor acima).
const iconMarkup = computed(() => {
  const tech = icon.value
  if (!tech) return ''
  return tech.svg ?? `<path d="${tech.path}" fill="currentColor" />`
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:text-foreground">
    <svg
      v-if="icon" :viewBox="icon.viewBox ?? '0 0 24 24'" class="size-3.5 shrink-0" :style="{ color: iconColor }"
      aria-hidden="true" v-html="iconMarkup"
    />
    {{ name }}
  </span>
</template>
