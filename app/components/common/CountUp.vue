<script setup lang="ts">
// Conta de 0 até `to` com desaceleração no final. O valor final fica num
// texto `sr-only` para leitores de tela e buscadores; o número animado é
// só visual. Com prefers-reduced-motion, mostra o valor final direto.
const props = withDefaults(defineProps<{
  to: number
  duration?: number
  delay?: number
}>(), {
  duration: 4000,
  delay: 0
})

const current = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined
let frame = 0

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    current.value = props.to
    return
  }

  timer = setTimeout(() => {
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / props.duration, 1)
      // easeOutCubic
      current.value = Math.round(props.to * (1 - (1 - progress) ** 3))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
  }, props.delay)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <span>
    <span class="sr-only">{{ to }}</span>
    <span aria-hidden="true" class="tabular-nums">{{ current }}</span>
  </span>
</template>
