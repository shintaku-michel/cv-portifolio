<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Check, ChevronLeft, ChevronRight, LogIn } from '@lucide/vue'

interface Slide {
  flag: string
  title: string
  description: string
  items?: string[]
  image: string
}

const slides: Slide[] = [
  {
    flag: 'Demo Bondry ao vivo',
    title: 'Experimente antes de comprar',
    description: 'A demo é uma instalação completa do Bondry, com o core e os quatro módulos pagos. Entre como administrador para conhecer o painel de administração, ou como membro para usar a comunidade como os seus membros usariam.',
    items: [
      'Conecte cada parte da sua comunidade.',
      'Gerencie conversas, conteúdo e postagens.',
      'Adicione Designer, LMS, Members Plus ou AI Connector para criar a experiência que sua comunidade precisa.'
    ],
    image: '/components/dashboard.png'
  },
  {
    flag: 'Fórum de discussão',
    title: 'Tirar dúvidas e estimular o debate de ideias',
    description: 'Dê aos membros um espaço organizado para perguntar, contribuir e trocar ideias. Estruture as discussões com fóruns dedicados, permissões por grupo e ferramentas de moderação.',
    items: [
      'Moderação por tópicos, respostas, enquetes e reações.',
      'Fila de denúncias, advertências e moderadores por fórum.',
      'Anúncios e uma busca que alcança todos os módulos.'
    ],
    image: '/components/community.png'
  },
  {
    flag: 'Blog',
    title: 'Escreva para sua comunidade',
    description: 'Mantenha comunicados, análises e artigos próximos do seu público. Organize publicações por categoria e permita que os membros participem por meio dos comentários.',
    items: [
      'Posts, categorias, imagem de capa e editor completo.',
      'Comentários com fila de denúncias própria.',
      'Cada ação com permissão por grupo de membros.'
    ],
    image: '/components/blog.png'
  },
  {
    flag: 'Designer · Módulo opcional',
    title: 'Sua identidade em cada página',
    description: 'Crie páginas e seções com um editor visual. Use templates reutilizáveis, condições de exibição e ajustes responsivos para manter uma experiência consistente em todo o site.',
    items: [
      'Páginas, cabeçalho, rodapé, 404 e tela de manutenção.',
      'Popups e barras flutuantes com gatilhos e condições.',
      'Blocos salvos e templates, com importação e exportação.'
    ],
    image: '/components/designer.png'
  },
  {
    flag: 'LMS · Módulo opcional',
    title: 'Faça do conhecimento parte da experiência',
    description: 'Ofereça cursos gratuitos ou pagos no espaço em que sua comunidade já se conecta. Organize aulas, acompanhe o progresso e reconheça a conclusão com certificados verificáveis online.',
    items: [
      'Seções, aulas, materiais e liberação programada.',
      'Quizzes, provas, certificados e verificação pública.',
      'Instrutores, divisão de receita e pedidos de repasse.'
    ],
    image: '/components/lms.png'
  },
  {
    flag: 'Members Plus · Módulo opcional',
    title: 'Crie valor com acesso exclusivo',
    description: 'Ofereça conteúdo exclusivo por meio de planos pagos. Vincule os pagamentos ao acesso dos membros, com períodos de teste, cupons e mudanças de plano gerenciados na plataforma.',
    items: [
      'Planos com teste grátis, termo vitalício e cupons.',
      'Paywall com prévia no fórum, no blog e nas páginas.',
      'Upgrade proporcional, cancelamentos e relatórios.'
    ],
    image: '/components/members-plus.png'
  },
  {
    flag: 'AI Connector · Módulo opcional',
    title: 'Deixe a IA trabalhar dentro das suas regras',
    description: 'Dê a uma IA um token preso a um grupo de membros e a um recorte, e depois leia cada chamada que ela fez. O módulo é a porta, não o modelo: o assistente é o que você já usa.',
    items: [
      'Tokens recortados por grupo de membros, somente leitura por padrão.',
      'Ensaio, confirmação em duas etapas e interruptor geral.',
      'API REST assinada e servidor MCP embutido.'
    ],
    image: '/components/ia-connector.png'
  },
  {
    flag: 'Pagamentos',
    title: 'Conecte sua comunidade ao seu negócio',
    description: 'Gerencie vendas e registros de pagamento com o sistema incluído no núcleo. Adicione módulos de gateway para os provedores de sua preferência, conforme os métodos disponíveis em cada um.',
    items: [
      'Stripe, PayPal e Mercado Pago como módulos separados.',
      'Cobrança avulsa, planos recorrentes e pagamento offline.',
      'Moeda de venda, faturas e webhooks num lugar só.'
    ],
    image: '/components/pagamentos.png'
  },
  {
    flag: 'Painel de Controle',
    title: 'Tenha o controle da operação',
    description: 'Gerencie membros, módulos, temas e idiomas em um painel. Use filtros, ações em lote, estatísticas e registros para acompanhar sua comunidade e conduzir as tarefas do dia a dia.',
    items: [
      'Membros, grupos, campos de perfil, filtros de banimento e ferramentas de IP.',
      'Módulos, temas e pacotes de idioma instalados por zip.',
      'Estatísticas e logs de sistema, erro, e-mail e administração.'
    ],
    image: '/components/painel.png'
  },
  {
    flag: 'Permissões',
    title: 'O acesso certo para cada responsabilidade',
    description: 'Defina quem pode visualizar, publicar, moderar e configurar sua comunidade. Permissões por grupo permitem distribuir responsabilidades na plataforma e em fóruns específicos.',
    items: [
      'Cada ação de módulo com permissão por grupo de membros.',
      'Verificação em duas etapas, filtros de banimento e exclusão de conta.',
      'Pacote de update conferido pela assinatura antes de ser aplicado.'
    ],
    image: '/components/permissoes.png'
  }
]

const HEIGHT = 588
const IMAGE_MAX_WIDTH = (HEIGHT - 64 - 112) * (568 / 430)
const SLIDE_DURATION = 1800 // duração da troca de um slide para o próximo, em ms

// Config troca imagem 
const fromIndex = ref(0)
const toIndex = ref(0)
const transition = ref(0)
const target = ref(0)
const reducedMotion = ref(false)

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

// Animação: avança uma troca por vez até chegar ao destino. Com cliques
let frame = 0
let lastTime = 0

function tick(now: number) {
  const elapsed = Math.min(now - lastTime, 50) // evita saltos após a aba ficar oculta
  lastTime = now

  if (fromIndex.value === toIndex.value) {
    if (target.value === fromIndex.value) {
      frame = 0
      return
    }
    toIndex.value = fromIndex.value + Math.sign(target.value - fromIndex.value)
    transition.value = 0
  }

  const direction = Math.sign(toIndex.value - fromIndex.value)
  const completing = Math.sign(target.value - fromIndex.value) === direction
  const speed = (Math.abs(target.value - fromIndex.value) > 1 ? 2.5 : 1) / SLIDE_DURATION
  transition.value = clamp(transition.value + (completing ? 1 : -1) * speed * elapsed)

  if (completing && transition.value === 1) {
    fromIndex.value = toIndex.value
    transition.value = 0
  } else if (!completing && transition.value === 0) {
    toIndex.value = fromIndex.value
  }
  frame = requestAnimationFrame(tick)
}

function goTo(destination: number) {
  target.value = clamp(destination, 0, slides.length - 1)
  if (reducedMotion.value) {
    fromIndex.value = toIndex.value = target.value
    transition.value = 0
    return
  }
  if (!frame) {
    lastTime = performance.now()
    frame = requestAnimationFrame(tick)
  }
}

const goPrevious = () => goTo(target.value - 1)
const goNext = () => goTo(target.value + 1)

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Pré-carrega as fotos para a troca não piscar.
  slides.forEach((item) => {
    new Image().src = item.image
  })
})

onBeforeUnmount(() => cancelAnimationFrame(frame))

// A troca tem duas fases seguidas: primeiro a imagem atravessa só depois que ela para, o texto novo aparece.
const IMAGE_PHASE = 0.65

const current = computed(() => slides[fromIndex.value]!)
const next = computed(() => (toIndex.value === fromIndex.value ? undefined : slides[toIndex.value]))
// Progresso (0 → 1, com aceleração suave) da fase da imagem.
const progress = computed(() => easeInOut(clamp(transition.value / IMAGE_PHASE)))

// Coluna (0 = esquerda, 1 = direita) da imagem no slide atual: alterna a cada slide
// O texto atual fica na coluna oposta; o próximo texto ocupa a coluna de onde a imagem sai.
const imageColumn = computed(() => fromIndex.value % 2)
const textColumn = computed(() => 1 - imageColumn.value)

// Imagem: atravessa para a coluna do texto.
const trackPosition = computed(() =>
  imageColumn.value === 0 ? progress.value : 1 - progress.value)

/* Efeito de monitor curvo: a imagem é dividida em fatias verticais dispostas
sobre um arco (raio em larguras da imagem). Com a perspectiva, as bordas de
cima e de baixo viram curvas. Valores em % e cqw (largura da imagem), então
o arco acompanha qualquer tamanho sem medir nada em JS. */
const SLICES = 20
const CURVE_RADIUS = 1.2
const curveSlices = Array.from({ length: SLICES }, (_, i) => {
  const angle = ((i + 0.5) / SLICES - 0.5) / CURVE_RADIUS // radianos
  return {
    style: {
      left: `${50 + CURVE_RADIUS * Math.sin(angle) * 100}%`,
      width: `calc(${100 / SLICES}% + 2px)`, // +2px evita frestas entre as fatias
      transform: `translateX(-50%) translateZ(${CURVE_RADIUS * (1 - Math.cos(angle)) * 100}cqw) rotateY(${-angle}rad)`
    },
    // Desloca a foto dentro da fatia para mostrar só o pedaço correspondente.
    imageOffset: `${(-i / SLICES) * 100}cqw`
  }
})

/* Lado menor (mais distante) voltado para dentro, na direção do texto: com a
imagem à esquerda, a borda direita; à direita, a esquerda. */
const curveTurn = computed(() => {
  const base = imageColumn.value === 0 ? 18 : -18
  return `rotateY(${base * (1 - 2 * progress.value)}deg)`
})
// A foto do próximo slide aparece no meio do trajeto.
const nextPhotoOpacity = computed(() => clamp((progress.value - 0.4) / 0.2))

/* Recuo com escurecimento: durante a travessia a imagem se afasta (até 92%) e
escurece (até 70% de opacidade), voltando ao normal no fim. */
const imageDepth = computed(() => {
  const dip = Math.sin(Math.PI * progress.value) // 0 nas pontas, 1 no meio
  return { scale: `${1 - 0.08 * dip}`, opacity: 1 - 0.3 * dip }
})

// Texto atual: empurrado pela imagem na mesma direção e distância.
const currentTextOffset = computed(() =>
  textColumn.value + (textColumn.value === 1 ? 1 : -1) * progress.value)
const currentTextOpacity = computed(() => 1 - clamp((progress.value - 0.5) / 0.5))

// Enquanto não estiver totalmente visível, o item não recebe clique.
function nextItemStyle(order: number) {
  const textPhase = clamp((transition.value - IMAGE_PHASE) / (1 - IMAGE_PHASE))
  const u = clamp((textPhase - order * 0.15) / 0.4)
  return { opacity: u, translate: `0 ${(1 - u) * 20}px`, pointerEvents: u < 1 ? 'none' as const : undefined }
}
</script>

<template>
  <section aria-roledescription="carrossel" aria-label="Funcionalidades"
    class="relative w-full lg:w-[min(80rem,calc(100vw-8rem))] lg:ml-[calc(50%-min(40rem,calc(50vw-4rem)))]">
    <div class="relative w-full overflow-hidden bg-card ring-1 ring-foreground/10 lg:h-(--carousel-height)"
      :style="{ '--carousel-height': `${HEIGHT}px` }">
      <div class="relative px-6 pt-8 lg:absolute lg:inset-0 lg:px-12 lg:pt-16 lg:pb-28">
        <div class="relative grid h-full content-start gap-8 lg:block">
          <!-- Imagem: a partir de lg, ocupa toda a altura da área de conteúdo. -->
          <div aria-hidden="true"
            class="relative z-10 lg:absolute lg:inset-y-0 lg:left-0 lg:w-[calc(50%-1.5rem)] lg:translate-x-[calc(var(--track)*(100%+3rem))]"
            :style="{ '--track': trackPosition }">

            <div class="lg:h-full" :style="imageDepth">
              <div class="carousel-intro-image lg:h-full"
                :style="{ '--intro-from': imageColumn === 0 ? '-50px' : '50px' }">
                <!-- Caixa sempre na proporção das fotos (568 × 430), sem cortar nem
                     distorcer: usa a largura da coluna, limitada à largura que cabe
                     na altura disponível (IMAGE_MAX_WIDTH). Se trocar o tamanho das
                     fotos, ajuste a proporção aqui e em IMAGE_MAX_WIDTH. -->
                <div
                  class="relative aspect-[568/430] w-full perspective-distant [container-type:inline-size] lg:mx-auto lg:w-[min(100%,var(--image-max-width))]"
                  :style="{ '--image-max-width': `${IMAGE_MAX_WIDTH}px` }">
                  <!-- Sombra de "flutuação": elipse desfocada abaixo da imagem, com um espaço entre as duas. -->
                  <div
                    class="pointer-events-none absolute -bottom-10 left-1/2 h-4 w-3/5 -translate-x-1/2 rounded-[50%] bg-black/40 blur-md dark:bg-black" />
                  <div class="absolute inset-0 transform-3d" :style="{ transform: curveTurn }">
                    <div v-for="(slice, i) in curveSlices" :key="i" class="absolute inset-y-0 overflow-hidden"
                      :class="{ 'rounded-l-2xl': i === 0, 'rounded-r-2xl': i === SLICES - 1 }" :style="slice.style">
                      <img :src="current.image" alt=""
                        class="absolute inset-y-0 h-full w-[100cqw] max-w-none object-cover"
                        :style="{ left: slice.imageOffset }">
                      <img v-if="next" :src="next.image" alt=""
                        class="absolute inset-y-0 h-full w-[100cqw] max-w-none object-cover"
                        :style="{ left: slice.imageOffset, opacity: nextPhotoOpacity }">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Texto atual -->
          <div
            class="col-start-1 row-start-2 lg:absolute lg:top-0 lg:left-0 lg:w-[calc(50%-1.5rem)] lg:translate-x-[calc(var(--offset)*(100%+3rem))]"
            :style="{ '--offset': currentTextOffset, opacity: currentTextOpacity }">
            <div class="flex flex-col gap-8">
              <div class="flex flex-col gap-2">
                <p class="carousel-fade-up text-sm font-medium text-blue-600 [animation-delay:0.2s] dark:text-blue-400">
                  {{ current.flag }}
                </p>
                <h3 class="carousel-fade-up text-3xl font-bold tracking-tight [animation-delay:0.4s] lg:text-4xl">
                  {{ current.title }}
                </h3>
                <p class="carousel-fade-up text-muted-foreground [animation-delay:0.6s]">
                  {{ current.description }}
                </p>
              </div>
              <ul v-if="current.items?.length"
                class="carousel-fade-up flex flex-col gap-1.5 text-sm text-muted-foreground [animation-delay:0.8s]">
                <li v-for="entry in current.items" :key="entry" class="flex gap-2">
                  <Check aria-hidden="true" class="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  {{ entry }}
                </li>
              </ul>

              <div class="carousel-fade-up [animation-delay:1s]">
                <Button as-child size="lg" variant="outline">
                  <NuxtLink to="/">
                    <LogIn />
                    Experimentar agora
                  </NuxtLink>
                </Button>
              </div>
            </div>
          </div>

          <!-- Próximo texto: cópia visual, escondida de leitores de tela. -->
          <div v-if="next" aria-hidden="true"
            class="col-start-1 row-start-2 lg:absolute lg:top-0 lg:left-0 lg:w-[calc(50%-1.5rem)] lg:translate-x-[calc(var(--offset)*(100%+3rem))]"
            :style="{ '--offset': imageColumn }">
            <div class="flex flex-col gap-8">
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-blue-600 dark:text-blue-400" :style="nextItemStyle(0)">
                  {{ next.flag }}
                </p>
                <h3 class="text-3xl font-bold tracking-tight lg:text-4xl" :style="nextItemStyle(1)">
                  {{ next.title }}
                </h3>
                <p class="text-muted-foreground" :style="nextItemStyle(2)">
                  {{ next.description }}
                </p>
              </div>

              <ul v-if="next.items?.length" class="flex flex-col gap-1.5 text-sm text-muted-foreground"
                :style="nextItemStyle(3)">
                <li v-for="entry in next.items" :key="entry" class="flex gap-2">
                  <Check class="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  {{ entry }}
                </li>
              </ul>

              <div :style="nextItemStyle(4)">
                <Button as-child size="lg" variant="outline">
                  <NuxtLink to="/" tabindex="-1">
                    <LogIn />
                    Experimentar agora
                  </NuxtLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controles: dentro do carrossel, centralizados embaixo -->
      <div
        class="relative z-20 flex items-center justify-between md:justify-center gap-4 px-6 pt-6 pb-8 lg:absolute lg:inset-x-0 lg:bottom-6 lg:p-0">
        <Button variant="outline" size="lg"
          class="cursor-pointer disabled:pointer-events-auto disabled:cursor-not-allowed" :disabled="target === 0"
          @click="goPrevious">
          <ChevronLeft />
          Prev
        </Button>
        <span aria-hidden="true" class="min-w-16 text-center text-sm tabular-nums text-muted-foreground">
          <span class="text-lg">{{ target + 1 }}</span> de {{ slides.length }}
        </span>
        <span aria-live="polite" class="sr-only">
          Slide {{ target + 1 }} de {{ slides.length }}: {{ slides[target]!.title }}
        </span>
        <Button variant="outline" size="lg"
          class="cursor-pointer disabled:pointer-events-auto disabled:cursor-not-allowed"
          :disabled="target === slides.length - 1" @click="goNext">
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel-fade-up {
  animation-name: carousel-fade-up;
  animation-duration: 0.6s;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}

.carousel-intro-image {
  animation: carousel-image-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes carousel-fade-up {
  from {
    opacity: 0;
    translate: 0 20px;
  }
}

@keyframes carousel-image-in {
  from {
    opacity: 0;
    translate: var(--intro-from) 0;
  }
}

@media (prefers-reduced-motion: reduce) {

  .carousel-fade-up,
  .carousel-intro-image {
    animation: none;
  }
}
</style>
