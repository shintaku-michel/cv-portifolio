<script setup lang="ts">
// Lupa de revelação: o conteúdo (slot) cobre a imagem de fundo por completo.
// Ao mover o mouse, um círculo ao redor do cursor "recorta" o conteúdo via
// CSS mask-image, deixando a imagem de fundo aparecer só naquela área.
// Sem mouse (touch) ou antes do primeiro movimento, o conteúdo fica 100%
// visível — o efeito é puramente decorativo, não esconde nada de verdade
// (mask-image não afeta a árvore de acessibilidade).
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  backgroundSrc?: string
  radius?: number
}>(), {
  backgroundSrc: undefined,
  radius: 160
})

const containerRef = ref<HTMLElement | null>(null)
const active = ref(false)

function updatePosition(event: MouseEvent) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  containerRef.value.style.setProperty('--reveal-x', `${event.clientX - rect.left}px`)
  containerRef.value.style.setProperty('--reveal-y', `${event.clientY - rect.top}px`)
  active.value = true
}

function reset() {
  active.value = false
}
</script>

<template>
  <div
    ref="containerRef"
    class="reveal-mask"
    :class="{ 'reveal-mask--active': active }"
    :style="{ '--reveal-radius': `${props.radius}px` }"
    @mousemove="updatePosition"
    @mouseleave="reset"
  >
    <div class="reveal-mask__background" aria-hidden="true">
      <img v-if="backgroundSrc" :src="backgroundSrc" alt="" class="h-full w-full object-cover">
    </div>
    <div class="reveal-mask__content" v-bind="$attrs">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.reveal-mask {
  --reveal-x: 50%;
  --reveal-y: 50%;
  position: relative;
  isolation: isolate;
  height: 100%;
  width: 100%;
}

.reveal-mask__background {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: var(--muted);
}

.reveal-mask__content {
  position: relative;
  z-index: 10;
  height: 100%;
  background: var(--background);
}

.reveal-mask--active .reveal-mask__content {
  mask-image: radial-gradient(circle var(--reveal-radius) at var(--reveal-x) var(--reveal-y), transparent 0%, transparent 70%, black 92%);
  -webkit-mask-image: radial-gradient(circle var(--reveal-radius) at var(--reveal-x) var(--reveal-y), transparent 0%, transparent 70%, black 92%);
}

@media (hover: none) {
  .reveal-mask__background {
    visibility: hidden;
  }

  .reveal-mask__content {
    mask-image: none !important;
    -webkit-mask-image: none !important;
  }
}
</style>
