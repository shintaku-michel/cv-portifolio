<script setup lang="ts">
import { ScrollVideoController } from '@/utils/scroll-video';

// Hero com vídeo controlado pelo scroll. A seção tem `scrollLength` telas de
// altura e um quadro sticky de 100dvh; enquanto o usuário rola, o vídeo avança
// e o conteúdo do slot é revelado (e some ao rolar de volta). A revelação de
// cada item é CSS puro (`.scroll-reveal` em tailwind.css) a partir de
// `--hero-progress`, para não re-renderizar o Vue a cada quadro.
const props = withDefaults(defineProps<{
  src: string
  srcSmall?: string
  poster: string
  fallback?: string
  fps?: number
  /** Fração do vídeo exibida ao fim do scroll (0–1); 1 = até o último quadro. */
  endAt?: number
  /** Altura da seção em telas (1 tela é o próprio hero; o resto é percurso de animação). */
  scrollLength?: number
  /** Progresso a partir do qual o conteúdo fica interativo e o slot recebe `revealed`. */
  revealAt?: number
}>(), {
  srcSmall: undefined,
  fallback: undefined,
  fps: 24,
  endAt: 1,
  scrollLength: 3,
  revealAt: 0.6
})

const sectionEl = ref<HTMLElement>()
const stickyEl = ref<HTMLElement>()
const videoEl = ref<HTMLVideoElement>()
const posterEl = ref<HTMLImageElement>()
const revealed = ref(false)
const atEnd = ref(false)

let controller: ScrollVideoController | undefined

onMounted(() => {
  if (!sectionEl.value || !stickyEl.value || !videoEl.value || !posterEl.value) return
  controller = new ScrollVideoController(
    { section: sectionEl.value, sticky: stickyEl.value, video: videoEl.value, poster: posterEl.value },
    {
      src: props.src,
      srcSmall: props.srcSmall,
      poster: props.poster,
      fallback: props.fallback,
      fps: props.fps,
      endAt: props.endAt,
      onProgress: (p) => {
        revealed.value = p >= props.revealAt
        atEnd.value = p >= 0.995
      }
    }
  )
})

onBeforeUnmount(() => controller?.destroy())

// Foco por teclado num item ainda invisível: rola até o conteúdo aparecer.
function onFocusIn() {
  if (!revealed.value) controller?.scrollToEnd()
}
</script>

<template>
  <section ref="sectionEl" class="scroll-hero" :style="{ '--scroll-length': scrollLength }">
    <div ref="stickyEl" class="scroll-hero__sticky">
      <!-- Mídia decorativa: oculta para tecnologias assistivas -->
      <div class="scroll-hero__media" aria-hidden="true">
        <img ref="posterEl" :src="poster" alt="" decoding="async" fetchpriority="high">
        <video ref="videoEl" muted playsinline preload="none" disablepictureinpicture disableremoteplayback
          tabindex="-1" />
        <div class="scroll-hero__scrim" />
        <!-- Indicador de rolagem, fixo perto da borda inferior durante todo o hero. -->
        <div class="scroll-hero__cue" :class="{ 'is-end': atEnd }">
          <span class="scroll-hero__wheel" />
        </div>
      </div>

      <div class="scroll-hero__content" :class="{ 'pointer-events-none': !revealed }" @focusin="onFocusIn">
        <slot :revealed="revealed" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.scroll-hero {
  --hero-progress: 0;
  position: relative;
  height: calc(var(--scroll-length) * 100vh);
  height: calc(var(--scroll-length) * 100svh);
  /* menor viewport no mobile: não “pula” quando as barras somem */
}

.scroll-hero__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

.scroll-hero__media {
  position: absolute;
  inset: 0;
}

.scroll-hero__media img,
.scroll-hero__media video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}

@media (max-aspect-ratio: 4/5) {

  .scroll-hero__media img,
  .scroll-hero__media video {
    object-position: 45% 50%;
  }
}

/* Poster por baixo; o vídeo aparece só depois do primeiro quadro decodificado. */
.scroll-hero__media video {
  opacity: 0;
  transition: opacity 0.35s ease;
}

.scroll-hero.is-ready video {
  opacity: 1;
}

.scroll-hero.is-fallback video {
  display: none;
}

/* Véu uniforme na cor do tema, presente desde o início do scroll: escurece
   a tela toda e mantém o contraste do texto conforme o conteúdo aparece. */
.scroll-hero__scrim {
  position: absolute;
  inset: 0;
  background: var(--background);
  opacity: 0.70;
}

/* Ícone de mouse branco centralizado perto da borda inferior. A "rodinha" sobe em
   loop durante o percurso e passa a descer quando o scroll chega ao fim do hero. */
.scroll-hero__cue {
  position: absolute;
  bottom: max(2rem, env(safe-area-inset-bottom));
  left: 50%;
  translate: -50% 0;
  width: 28px;
  height: 46px;
  border: 2px solid #fff;
  border-radius: 14px;
  opacity: 0.5;
}

.scroll-hero__wheel {
  position: absolute;
  top: 8px;
  left: 50%;
  width: 4px;
  height: 8px;
  margin-left: -2px;
  border-radius: 2px;
  background: #fff;
  animation: scroll-hero-wheel 1.8s ease-in-out infinite;
}

@keyframes scroll-hero-wheel {
  0% {
    opacity: 0;
    translate: 0 14px;
  }

  30% {
    opacity: 1;
  }

  70% {
    opacity: 1;
    translate: 0 2px;
  }

  100% {
    opacity: 0;
    translate: 0 0;
  }
}

.scroll-hero__cue.is-end .scroll-hero__wheel {
  animation-name: scroll-hero-wheel-down;
}

@keyframes scroll-hero-wheel-down {
  0% {
    opacity: 0;
    translate: 0 0;
  }

  30% {
    opacity: 1;
  }

  70% {
    opacity: 1;
    translate: 0 12px;
  }

  100% {
    opacity: 0;
    translate: 0 14px;
  }
}

.scroll-hero__content {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Movimento reduzido: imagem estática, conteúdo visível, sem trecho prolongado. */
.scroll-hero.is-static {
  height: auto;
}

.scroll-hero.is-static .scroll-hero__sticky {
  position: relative;
  height: auto;
  min-height: 100dvh;
}

.scroll-hero.is-static video {
  display: none;
}

.scroll-hero.is-static .scroll-hero__content {
  height: auto;
  min-height: 100dvh;
}

.scroll-hero.is-static .scroll-hero__cue {
  display: none;
}

@media (prefers-reduced-motion: reduce) {

  /* garante o estado estático mesmo antes do JS rodar */
  .scroll-hero {
    --hero-progress: 1;
    height: auto;
  }

  .scroll-hero__sticky {
    position: relative;
    height: auto;
    min-height: 100dvh;
  }

  .scroll-hero video {
    display: none;
  }

  .scroll-hero__content {
    height: auto;
    min-height: 100dvh;
  }

  .scroll-hero__cue {
    display: none;
  }
}
</style>
