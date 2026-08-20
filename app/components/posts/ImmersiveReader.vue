<script setup lang="ts">
import { PauseIcon, PlayIcon, XIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { extractReadableBlocks, renderMarkdown, splitSentences } from '@/utils/markdown'

const props = defineProps<{
  title: string
  content: string
}>()

const open = defineModel<boolean>('open', { default: false })

type TextSize = 'small' | 'medium' | 'large'
type Theme = 'light' | 'dark'
type FocusMode = 'line' | 'block'

const textSize = ref<TextSize>('medium')
const theme = ref<Theme>('light')
const focusMode = ref<FocusMode>('line')
const speed = ref(1)
const voiceGender = ref<'female' | 'male'>('female')

const isPlaying = ref(false)
const currentChunkIndex = ref(-1)

const textSizeClasses: Record<TextSize, string> = {
  small: 'text-lg',
  medium: 'text-2xl',
  large: 'text-4xl'
}

const blocks = computed(() => extractReadableBlocks(renderMarkdown(props.content)))
const blockSentences = computed(() => blocks.value.map(splitSentences))

interface Chunk {
  blockIndex: number
  sentenceIndex: number
  text: string
}

const chunks = computed<Chunk[]>(() => {
  const result: Chunk[] = []
  blockSentences.value.forEach((sentences, blockIndex) => {
    sentences.forEach((text, sentenceIndex) => result.push({ blockIndex, sentenceIndex, text }))
  })
  return result
})

// A API Web Speech não expõe gênero da voz — heurística por nome comum,
// best-effort (varia por navegador/SO). Sem voz reconhecida, o botão fica
// desabilitado em vez de mentir sobre qual voz será usada.
const FEMALE_HINTS = ['female', 'feminina', 'luciana', 'joana', 'samantha', 'victoria', 'karen', 'zira', 'fiona', 'moira', 'tessa']
const MALE_HINTS = ['male', 'masculina', 'felipe', 'daniel', 'fred', 'diego', 'thomas', 'george', 'jorge', 'ricardo']

function classifyVoice(voice: SpeechSynthesisVoice): 'female' | 'male' | null {
  const name = voice.name.toLowerCase()
  if (FEMALE_HINTS.some(hint => name.includes(hint))) return 'female'
  if (MALE_HINTS.some(hint => name.includes(hint))) return 'male'
  return null
}

const voices = ref<SpeechSynthesisVoice[]>([])

function loadVoices() {
  voices.value = window.speechSynthesis.getVoices()
}

const ptVoices = computed(() => {
  const pt = voices.value.filter(v => v.lang.toLowerCase().startsWith('pt'))
  return pt.length ? pt : voices.value
})

const femaleVoice = computed(() => ptVoices.value.find(v => classifyVoice(v) === 'female') ?? null)
const maleVoice = computed(() => ptVoices.value.find(v => classifyVoice(v) === 'male') ?? null)
const selectedVoice = computed(() => (voiceGender.value === 'female' ? femaleVoice.value : maleVoice.value))

let utterances: SpeechSynthesisUtterance[] = []

function stop() {
  window.speechSynthesis.cancel()
  isPlaying.value = false
  currentChunkIndex.value = -1
}

function playFrom(startIndex: number) {
  window.speechSynthesis.cancel()
  const queue = chunks.value.slice(startIndex)
  if (!queue.length) return

  utterances = queue.map((chunk, offset) => {
    const utterance = new SpeechSynthesisUtterance(chunk.text)
    utterance.lang = 'pt-BR'
    utterance.rate = speed.value
    if (selectedVoice.value) utterance.voice = selectedVoice.value
    utterance.onstart = () => {
      currentChunkIndex.value = startIndex + offset
    }
    if (offset === queue.length - 1) {
      utterance.onend = () => {
        isPlaying.value = false
        currentChunkIndex.value = -1
      }
    }
    return utterance
  })

  utterances.forEach(u => window.speechSynthesis.speak(u))
  isPlaying.value = true
}

function togglePlay() {
  if (isPlaying.value) {
    window.speechSynthesis.pause()
    isPlaying.value = false
    return
  }
  if (window.speechSynthesis.paused && currentChunkIndex.value >= 0) {
    window.speechSynthesis.resume()
    isPlaying.value = true
    return
  }
  playFrom(0)
}

// Muda voz/velocidade em tempo real: reinicia a fala a partir da frase atual.
watch([speed, selectedVoice], () => {
  if (currentChunkIndex.value >= 0) {
    playFrom(currentChunkIndex.value)
  }
})

watch(open, (isOpen) => {
  if (!isOpen) stop()
})

onMounted(() => {
  loadVoices()
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
})

onUnmounted(() => {
  window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  window.speechSynthesis.cancel()
})

function isDimmed(blockIndex: number, sentenceIndex: number): boolean {
  if (currentChunkIndex.value < 0) return false
  const current = chunks.value[currentChunkIndex.value]
  if (!current) return false
  if (focusMode.value === 'block') return current.blockIndex !== blockIndex
  return !(current.blockIndex === blockIndex && current.sentenceIndex === sentenceIndex)
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      :show-close-button="false"
      class="inset-0 top-0 left-0 grid h-screen w-screen max-w-none translate-x-0 translate-y-0 grid-rows-[auto_1fr] gap-0 rounded-none bg-background p-0 text-foreground sm:max-w-none"
      :class="theme === 'dark' ? 'dark' : ''"
    >
      <DialogTitle class="sr-only">
        Leitor imersivo — {{ title }}
      </DialogTitle>

      <header class="flex flex-wrap items-center gap-4 border-b border-current/10 px-6 py-3">
        <DialogClose as-child>
          <Button variant="ghost" size="icon" aria-label="Fechar leitor imersivo">
            <XIcon class="size-5" />
          </Button>
        </DialogClose>

        <span class="truncate text-sm font-medium">{{ title }}</span>

        <div class="ml-auto flex flex-wrap items-center gap-4">
          <div role="group" aria-label="Tamanho do texto" class="flex gap-1">
            <Button
              v-for="size in (['small', 'medium', 'large'] as const)"
              :key="size"
              type="button"
              size="sm"
              :variant="textSize === size ? 'default' : 'outline'"
              :aria-pressed="textSize === size"
              @click="textSize = size"
            >
              <span :class="{ 'text-xs': size === 'small', 'text-sm': size === 'medium', 'text-base': size === 'large' }">A</span>
              <span class="sr-only">
                {{ size === 'small' ? 'Pequeno' : size === 'medium' ? 'Médio' : 'Grande' }}
              </span>
            </Button>
          </div>

          <div role="group" aria-label="Tema" class="flex gap-1">
            <Button
              type="button"
              size="sm"
              :variant="theme === 'light' ? 'default' : 'outline'"
              :aria-pressed="theme === 'light'"
              @click="theme = 'light'"
            >
              Claro
            </Button>
            <Button
              type="button"
              size="sm"
              :variant="theme === 'dark' ? 'default' : 'outline'"
              :aria-pressed="theme === 'dark'"
              @click="theme = 'dark'"
            >
              Escuro
            </Button>
          </div>

          <div role="group" aria-label="Modo de foco de leitura" class="flex gap-1">
            <Button
              type="button"
              size="sm"
              :variant="focusMode === 'line' ? 'default' : 'outline'"
              :aria-pressed="focusMode === 'line'"
              @click="focusMode = 'line'"
            >
              Por linha
            </Button>
            <Button
              type="button"
              size="sm"
              :variant="focusMode === 'block' ? 'default' : 'outline'"
              :aria-pressed="focusMode === 'block'"
              @click="focusMode = 'block'"
            >
              Bloco
            </Button>
          </div>

          <div role="group" aria-label="Voz" class="flex gap-1">
            <Button
              type="button"
              size="sm"
              :variant="voiceGender === 'female' ? 'default' : 'outline'"
              :aria-pressed="voiceGender === 'female'"
              :disabled="!femaleVoice"
              @click="voiceGender = 'female'"
            >
              Feminina
            </Button>
            <Button
              type="button"
              size="sm"
              :variant="voiceGender === 'male' ? 'default' : 'outline'"
              :aria-pressed="voiceGender === 'male'"
              :disabled="!maleVoice"
              @click="voiceGender = 'male'"
            >
              Masculina
            </Button>
          </div>

          <div class="flex items-center gap-2">
            <label for="reader-speed" class="text-sm">Velocidade</label>
            <input
              id="reader-speed"
              v-model.number="speed"
              type="range"
              min="0.5"
              max="2"
              step="0.25"
              class="w-24"
            >
            <span class="w-10 text-sm tabular-nums">{{ speed }}x</span>
          </div>

          <Button type="button" size="sm" :aria-pressed="isPlaying" @click="togglePlay">
            <PauseIcon v-if="isPlaying" class="size-4" />
            <PlayIcon v-else class="size-4" />
            {{ isPlaying ? 'Pausar' : 'Escutar' }}
          </Button>
        </div>
      </header>

      <div
        tabindex="0"
        role="region"
        :aria-label="`Conteúdo do post: ${title}`"
        class="overflow-y-auto px-6 py-10 sm:px-[10%]"
      >
        <div
          class="mx-auto flex max-w-3xl flex-col gap-6 leading-relaxed font-medium"
          :class="textSizeClasses[textSize]"
        >
          <p v-for="(sentences, blockIndex) in blockSentences" :key="blockIndex">
            <span
              v-for="(sentence, sentenceIndex) in sentences"
              :key="sentenceIndex"
              class="transition-opacity duration-150"
              :class="isDimmed(blockIndex, sentenceIndex) ? 'opacity-30' : 'opacity-100'"
            >{{ sentence + ' ' }}</span>
          </p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
