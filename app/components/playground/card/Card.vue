<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HeartIcon } from '@lucide/vue'

const member = {
  name: 'Ana Carolina',
  role: 'Product Designer',
  image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80',
  bio: 'Focada em transformar problemas complexos em interfaces simples, acessíveis e bonitas de usar.',
  tags: ['UX', 'UI', 'Design System']
}

const tagPalette = [
  'text-purple-400 ring-1 ring-purple-400/20', // roxo
  'text-pink-400 ring-1 ring-pink-400/20', // lilás
  'text-yellow-200 ring-1 ring-yellow-400/20' // amarelo
]

const liked = ref(false)
const likesCount = ref(24)

interface FloatingHeart {
  id: number
  left: number
  duration: number
  delay: number
  drift: number
}

const floatingHearts = ref<FloatingHeart[]>([])
let nextHeartId = 0

function burstHearts(count: number) {
  for (let i = 0; i < count; i++) {
    const id = nextHeartId++
    const delay = i * 0.18 + Math.random() * 0.1
    floatingHearts.value.push({
      id,
      left: 15 + Math.random() * 70,
      duration: 1.3 + Math.random() * 0.7,
      delay,
      drift: (Math.random() - 0.5) * 70
    })
    setTimeout(() => {
      floatingHearts.value = floatingHearts.value.filter(heart => heart.id !== id)
    }, (delay + 2.2) * 1000)
  }
}

function toggleLike() {
  liked.value = !liked.value
  likesCount.value += liked.value ? 1 : -1
  if (liked.value) burstHearts(likesCount.value)
}
</script>

<template>
  <Card class="w-full flex-col gap-2 rounded-lg p-0 min-[700px]:flex-row">
    <div
      class="relative h-65 w-full overflow-hidden rounded-t-lg min-[700px]:h-auto min-[700px]:w-1/2 min-[700px]:min-w-[50%] min-[700px]:self-stretch min-[700px]:rounded-t-none min-[700px]:rounded-l-lg">
      <img :src="member.image" :alt="member.name" class="h-full w-full object-cover">

      <div class="pointer-events-none absolute inset-0">
        <HeartIcon v-for="heart in floatingHearts" :key="heart.id"
          class="floating-heart absolute size-6 fill-red-500 text-red-500" :style="{
            left: `${heart.left}%`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            '--drift': `${heart.drift}px`,
          }" />
      </div>
    </div>

    <CardContent class="flex flex-col gap-4 px-6 py-6 min-[480px]:flex-1 min-[480px]:justify-center min-[700px]:pr-6">
      <div>
        <h2 class="text-2xl font-normal">
          {{ member.name }}
        </h2>
        <h3 class="text-lg font-normal text-muted-foreground">
          {{ member.role }}
        </h3>
      </div>

      <p class="truncate text-muted-foreground min-[560px]:text-wrap min-[560px]:whitespace-normal">
        {{ member.bio }}
      </p>

      <div
        class="flex flex-col gap-4 pb-4 min-[560px]:flex-row min-[560px]:items-center min-[700px]:flex-col min-[700px]:items-start">
        <div class="flex gap-2.5">
          <Badge v-for="(tag, index) in member.tags" :key="tag" variant="secondary"
            class="h-auto rounded-2xl px-3 py-1 text-sm font-normal italic backdrop-blur-lg"
            :class="tagPalette[index % tagPalette.length]">
            {{ tag }}
          </Badge>
        </div>

        <div class="flex gap-2 min-[560px]:ml-auto min-[700px]:mt-4 min-[700px]:ml-0">
          <Button
            class="h-12 w-full flex-1 rounded-full px-6 min-[560px]:w-fit min-[560px]:flex-none cursor-pointer border border-transparent transition-colors hover:border-foreground/70"
            variant="default">
            Contrate agora
          </Button>
          <div class="flex items-center gap-1.5">
            <Button size="icon" variant="secondary" :aria-pressed="liked" aria-label="Curtir"
              class="size-12 shrink-0 rounded-full bg-foreground/10 hover:bg-foreground/18 cursor-pointer"
              :class="liked && 'bg-red-500 text-white hover:bg-red-700'" @click="toggleLike">
              <HeartIcon :class="liked && 'fill-current'" />
            </Button>
            <span class="text-sm text-muted-foreground">+{{ likesCount }}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
.floating-heart {
  animation-name: float-up;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}

@keyframes float-up {
  0% {
    bottom: 1rem;
    transform: translateX(0) scale(0.5);
    opacity: 0;
  }

  15% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }

  100% {
    bottom: 50%;
    transform: translateX(var(--drift)) scale(0.85);
    opacity: 0;
  }
}
</style>
