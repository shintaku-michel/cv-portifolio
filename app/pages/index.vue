<script setup lang="ts">
import type { Post } from '#shared/types/post'
import type { Project } from '#shared/types/project'
import homeBg from '@/assets/img/bg-home-02.png'
import profileBg from '@/assets/img/bg-profile-01.png'
import michelDark from '@/assets/img/michel-dark.png'
import michelLight from '@/assets/img/michel-light.png'
import TechMarquee from '@/components/common/TechMarquee.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Code2Icon, FileBadge, FolderGit2Icon, MailIcon } from '@lucide/vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Início',
  description: 'Projetos, artigos e experiências construídos com Nuxt, GraphQL e PostgreSQL.',
  ogTitle: 'Portfolio CMS',
  ogUrl: requestUrl.origin
})
useHead({ link: [{ rel: 'canonical', href: requestUrl.origin }] })

const { data: projectsData } = await useAsyncData('home-featured-projects', () =>
  useGraphQL<{ featuredProjects: Project[] }>(`
    query FeaturedProjects {
      featuredProjects {
        id title slug shortDescription coverImage
        technologies { id name slug }
      }
    }
  `)
)

const { data: postsData } = await useAsyncData('home-latest-posts', () =>
  useGraphQL<{ posts: Post[] }>(`
    query LatestPosts {
      posts {
        id title slug excerpt publishedAt
      }
    }
  `)
)

const latestPosts = computed(() => (postsData.value?.posts ?? []).slice(0, 3))

function formatDate(value: string | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

// A barra de ícones navega por hash (`/#secao`) — só a seção correspondente
// fica visível por vez, em vez da página rolar por todas elas. A troca entre
// seções usa uma transição suave (fade) no lugar do scroll que existia antes.
//
// O hash da URL nunca chega ao servidor (é só do navegador) — então o SSR
// sempre renderiza "início", não importa qual seção a URL pedia. Se
// activeSection usasse route.hash direto, um load/reload em algo como
// "/#perfil" faria o cliente trocar de seção JÁ durante a hidratação,
// bem no meio da reconciliação do <Transition> — o resultado observado era
// uma mistura quebrada (texto da seção nova com as classes de layout da
// seção antiga, daí o alinhamento e o clipping "aleatórios"). Isso também
// explica quebrar ao alternar mobile/desktop no DevTools: isso recarrega a
// URL atual, e se ela tiver uma hash de seção, cai no mesmo problema.
//
// A correção: no primeiro render (client ou server) sempre usar "início",
// igual ao SSR — só depois do mount (garantidamente pós-hidratação) é que
// activeSection passa a refletir a hash real, como uma troca reativa normal
// e não mais um conflito durante a hidratação.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const route = useRoute()
const activeSection = computed(() => {
  if (!mounted.value) return 'inicio'
  return route.hash ? route.hash.slice(1) : 'inicio'
})

// Avatar troca de foto junto com o tema global (claro/escuro).
const { theme } = useTheme()
const avatarSrc = computed(() => (theme.value === 'dark' ? michelDark : michelLight))
</script>

<template>
  <div class="flex flex-col gap-24">
    <Transition name="section-fade" mode="out-in">
      <section v-if="activeSection === 'inicio'" id="inicio" key="inicio"
        class="relative min-h-screen bg-cover bg-center bg-no-repeat lg:h-dvh lg:min-h-0 lg:overflow-hidden"
        :style="{ backgroundImage: `url(${homeBg})` }">
        <!-- Scrim sobre a foto de fundo para garantir contraste do texto. -->
        <div class="absolute inset-0 bg-background/75" aria-hidden="true">
          <div
            class="relative flex min-h-dvh w-full flex-col-reverse items-center justify-center gap-10 px-6 py-16 text-center lg:flex-row lg:gap-24 lg:px-8 lg:py-0 lg:text-start">
            <div class="flex w-full min-w-0 max-w-2xl flex-col items-center lg:w-auto lg:items-start">
              <p class="text-lg font-light text-foreground/70 sm:text-xl">
                こんにちは世界！私は
              </p>
              <h1 class="mt-2 text-4xl font-semibold sm:text-5xl lg:text-6xl">
                Michel Shintaku
              </h1>
              <p class="mt-2 text-2xl font-semibold sm:text-3xl lg:text-4xl">
                Full Stack Developer
              </p>

              <p class="mt-4 font-light text-foreground/70">
                Crio produtos digitais que unem tecnologia e estratégia, com foco no usuário,
                <br class="hidden sm:inline">transformando necessidades reais em soluções inovadoras.
              </p>

              <div class="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button as-child size="lg">
                  <NuxtLink to="/#projetos">
                    <FolderGit2Icon />
                    Veja meu trabalho
                  </NuxtLink>
                </Button>
                <Button as-child size="lg" variant="outline">
                  <NuxtLink to="/#contato">
                    <MailIcon />
                    Fale comigo
                  </NuxtLink>
                </Button>
              </div>

              <TechMarquee class="mt-4 w-full max-w-xl" />
            </div>

            <div class="relative shrink-0">
              <img :src="avatarSrc" alt="Michel Shintaku"
                class="h-40 w-40 rounded-full object-cover ring-3 ring-[#aaaaaa] sm:h-52 sm:w-52 lg:h-60 lg:w-60">
              <div
                class="absolute -right-1 -bottom-1 flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-[#999999] lg:h-16 lg:w-16">
                <Code2Icon class="size-6 text-muted-foreground lg:size-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'perfil'" id="perfil" key="perfil"
        class="relative min-h-screen bg-cover bg-center bg-no-repeat lg:h-dvh lg:min-h-0 lg:overflow-hidden"
        :style="{ backgroundImage: `url(${profileBg})` }">
        <div class="flex flex-col items-center justify-center gap-4 text-left">
          <div class="md:ml-16 md:h-full">
            <div class="px-6 py-24 md:mx-auto md:w-3xl">
              <h1 class="mb-4 text-2xl font-semibold">
                Perfil
              </h1>

              <p class="text-muted-foreground mb-4">
                Nasci em Goiânia e cresci em Brasília. Desde cedo, a arte esteve presente na minha vida e se tornou
                parte importante da minha formação.
              </p>
              <p class="text-muted-foreground mb-4">
                A tecnologia, o design, a música e a cultura japonesa estão entre as principais influências que
                despertaram minha criatividade e ajudaram a moldar quem sou
                hoje.
              </p>

              <p class="text-muted-foreground mb-4">
                Aos 14 anos, tive a oportunidade de viver por quase uma década no Japão, uma experiência que
                transformou minha forma de enxergar o mundo e aprofundou valores como disciplina, honestidade,
                organização,
                resiliência e senso de coletividade. Essa vivência ampliou minha perspectiva e fortaleceu princípios que
                carrego comigo e que, até hoje, fazem parte de quem sou.
              </p>

              <p class="text-muted-foreground mb-4">
                Hoje, sou desenvolvedor Full Stack e tenho mais de 18 anos de experiência na criação de produtos
                digitais. Minha trajetória na tecnologia começou em 2005 e, desde 2007, trabalho profissionalmente
                transformando ideias e necessidades em soluções digitais.
              </p>

              <p class="text-muted-foreground">
                Ao longo dessa trajetória, busco criar experiências que equilibrem tecnologia, usabilidade,
                acessibilidade e regras de negócio, sem perder de vista o mais importante: as pessoas que estão do outro
                lado da tela usando o produto.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'valores'" id="valores" key="valores"
        class="min-h-screen scroll-mt-8 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
        <div class="flex flex-col items-center justify-center gap-4 text-left">
          <div class="md:ml-16 md:h-full">
            <div class="px-6 py-24 md:mx-auto md:w-3xl">
              <h1 class="mb-4 text-2xl font-semibold">
                Valores
              </h1>
              <p class="text-muted-foreground mb-4">
                Acredito que um bom trabalho começa com planejamento, disciplina e aprendizado contínuo. A tecnologia
                está sempre mudando, e acompanhar essa evolução faz parte do nosso trabalho. Reaprender, experimentar e
                estar
                disposto a mudar também são formas de evoluir.
              </p>

              <p class="text-muted-foreground mb-4">
                Prefiro a comunicação direta e honesta. Problemas devem ser compartilhados o quanto antes, antes que
                se tornem maiores. Questionar, pedir ajuda, ouvir diferentes perspectivas e compartilhar conhecimento
                também
                fazem parte do trabalho em equipe.
              </p>

              <p class="text-muted-foreground mb-4">
                A inspiração pode iniciar uma ideia, mas é a consistência que a transforma em resultado. Pequenos
                avanços,
                repetidos ao longo do tempo, fazem as coisas acontecerem. Os desafios fazem parte do processo, e
                enfrentá-los
                com paciência e persistência também faz parte do trabalho.
              </p>

              <p class="text-muted-foreground mb-4">
                Os melhores sistemas que construí ao longo da minha carreira nasceram ao lado de pessoas que realmente
                se importam com o que fazem.
              </p>

              <p class="text-muted-foreground mb-4">
                Escolha bem as pessoas com quem você trabalha. E, quando não puder escolher, lembre-se: você ainda pode
                fazer a sua parte, elevar o nível ao seu redor e contribuir para um ambiente mais colaborativo,
                respeitoso e comprometido com a excelência.
              </p>

              <p class="text-muted-foreground mb-4">
                Não romantize os erros. Reconheça-os, corrija o que for possível, mude o curso quando necessário,
                aprenda com eles e siga em frente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'formacao'" id="formacao" key="formacao"
        class="min-h-screen scroll-mt-8 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
        <div class="flex flex-col items-center justify-center gap-4 text-left">
          <div class="md:ml-16 md:h-full">
            <div class="px-6 py-24 md:mx-auto md:w-3xl">
              <h1 class="mb-4 text-2xl font-semibold">
                Formação
              </h1>
              <p class="text-muted-foreground mb-4">
                Sou graduado em Ciência da Computação pelo Centro Universitário de Brasília (CEUB) e pós-graduado em
                Full
                Stack & IA pela Faculdade de Tecnologia Rocketseat. Minha formação, somada a mais de 18 anos de
                experiência
                prática no desenvolvimento web, me permite unir fundamentos de computação, desenvolvimento de
                software e
                o uso das tecnologias mais adequadas para criar cada solução digital.
              </p>
              <p class="text-muted-foreground mb-4">
                Ao longo da minha trajetória, mantenho o hábito de continuar estudando, experimentando novas
                tecnologias e
                aprofundando conhecimentos que possam contribuir para a
                qualidade do meu trabalho.
              </p>
              <p class="text-muted-foreground mb-4">
                Humildade para reconhecer que não sei tudo, valorizar o conhecimento e a experiência de outras pessoas,
                e sabedoria para continuar estudando, aprendendo e evoluindo.
              </p>

              <div class="mt-6 flex gap-2">
                <Button as-child size="lg">
                  <NuxtLink to="/pos-graduacao" class="flex gap-2">
                    <FileBadge />
                    Pós-Graduação
                  </NuxtLink>
                </Button>
                <Button as-child size="lg">
                  <NuxtLink to="/graduacao" class="flex gap-2">
                    <FileBadge />
                    Graduação
                  </NuxtLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'cursos'" id="cursos" key="cursos"
        class="min-h-screen scroll-mt-8 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
        <div class="flex flex-col items-center justify-center gap-4 text-left">
          <div class="md:ml-16 md:h-full">
            <div class="px-6 py-24 md:mx-auto md:w-3xl">
              <h1 class="mb-4 text-2xl font-semibold">
                Cursos
              </h1>
              <p class="text-muted-foreground mb-4">
                Ao longo da minha carreira, busquei ampliar meus conhecimentos em diferentes áreas do desenvolvimento
                de
                software. Tenho cursos em UX/UI Design, acessibilidade (A11y), Frontend, Backend e DevOps. Sempre fui
                muito
                curioso e procurei entender diferentes partes do processo de desenvolvimento para ter mais autonomia,
                explorar
                novas possibilidades e não ficar limitado por uma única área da tecnologia.
              </p>
              <p class="text-muted-foreground mb-4">
                Mais do que acumular certificados, busco conhecimentos que possam ser aplicados na prática e que me
                ajudem
                a compreender melhor todo o processo de criação dos produtos digitais que desenvolvo.
              </p>

              <div class="mt-6">
                <Button as-child size="lg">
                  <NuxtLink to="/certificados" class="flex gap-2">
                    <FileBadge />
                    Certificados
                  </NuxtLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'experiencia'" id="experiencia" key="experiencia"
        class="min-h-screen scroll-mt-8 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
        <div class="flex flex-col items-center justify-center gap-4 text-left">
          <div class="md:ml-16 md:h-full">
            <div class="px-6 py-24 md:mx-auto md:w-3xl">
              <h1 class="mb-4 text-2xl font-semibold">
                Experiência
              </h1>
              <p class="text-muted-foreground mb-4">
                Comecei minha carreira no Backend, onde aprendi a construir APIs, aplicar técnicas de segurança de
                software e trabalhar com padrões de desenvolvimento e diferentes modelos de arquitetura.
              </p>
              <p class="text-muted-foreground mb-4">
                Era uma época em que desenvolver em Java exigia muito mais do que dominar a linguagem. Era preciso
                compreender configurações, empacotamento, servidores de aplicação e toda a infraestrutura necessária
                para colocar um sistema em funcionamento. Nesse período, trabalhei com tecnologias como Spring,
                Hibernate, Tomcat e JBoss, além do Angular no Frontend.
              </p>
              <p class="text-muted-foreground mb-4">
                Com o tempo, minha curiosidade me levou a explorar cada vez mais o Frontend, uma área em que
                naturalmente comecei a me destacar. Talvez isso tenha relação com a minha história, minha cultura e,
                principalmente, com meu interesse por arte, design e pelo processo de transformar ideias em
                experiências.
              </p>
              <p class="text-muted-foreground mb-4">
                Em uma das fábricas de software por onde passei, tive a oportunidade de liderar um time de Frontend e me
                aprofundar ainda mais nessa camada que tanto admiro. Nesse período, também me aproximei de UX, uma área
                que considero fundamental para a construção de produtos melhores — e sobre a qual poderia passar horas
                conversando também.
              </p>
              <p class="text-muted-foreground mb-4">
                Mais tarde, quando voltei a trabalhar com Backend, dessa vez com Node.js, percebi o quanto a experiência
                no Frontend havia ampliado minha visão como desenvolvedor. Passei a construir APIs pensando também em
                quem iria consumi-las, buscando torná-las mais intuitivas, consistentes e fáceis de integrar. Mais do
                que isso, comecei a enxergar o desenvolvimento de software de forma mais completa, entendendo melhor
                como cada decisão técnica influencia o produto e a experiência de quem o utiliza.
              </p>
              <p class="text-muted-foreground mb-4">
                Hoje, continuo estudando, experimentando novas tecnologias e aprimorando minhas práticas, sempre
                buscando evoluir e encontrar maneiras melhores de transformar ideias em soluções.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'projetos'" id="projetos" key="projetos"
        class="min-h-screen scroll-mt-8 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
        <div class="flex flex-col items-center justify-center gap-4 text-left">
          <div class="md:ml-16 md:h-full">
            <div class="px-6 py-24 md:mx-auto md:w-3xl">
              <div class="mb-6 flex items-center justify-between gap-2 px-1">
                <h1 class="text-2xl font-semibold">
                  Projetos
                </h1>
                <NuxtLink to="/projetos" class="text-sm text-muted-foreground hover:underline">
                  Ver todos
                </NuxtLink>
              </div>

              <div v-if="projectsData?.featuredProjects.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                <NuxtLink v-for="project in projectsData.featuredProjects" :key="project.id"
                  :to="`/projetos/${project.slug}`"
                  class="flex flex-col gap-3 rounded-sm border p-5 transition-colors hover:bg-accent">
                  <img v-if="project.coverImage" :src="project.coverImage" :alt="project.title"
                    class="aspect-video w-full rounded-sm object-cover">
                  <h2 class="text-lg font-medium">
                    {{ project.title }}
                  </h2>
                  <p class="text-sm text-muted-foreground">
                    {{ project.shortDescription }}
                  </p>
                  <div v-if="project.technologies.length" class="flex flex-wrap gap-1">
                    <Badge v-for="tech in project.technologies" :key="tech.id" variant="outline">
                      {{ tech.name }}
                    </Badge>
                  </div>
                </NuxtLink>
              </div>
              <p v-else class="text-muted-foreground">
                Nenhum projeto em destaque no momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'blog'" id="blog" key="blog"
        class="min-h-screen scroll-mt-8 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
        <div class="flex flex-col items-center justify-center gap-4 text-left">
          <div class="md:ml-16 md:h-full">
            <div class="px-6 py-24 md:mx-auto md:w-3xl">
              <div class="mb-6 flex items-center justify-between px-1">
                <h1 class="text-2xl font-semibold">
                  Blog
                </h1>
                <NuxtLink to="/posts" class="text-sm text-muted-foreground hover:underline">
                  Ver todos
                </NuxtLink>
              </div>

              <div v-if="latestPosts.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                <NuxtLink v-for="post in latestPosts" :key="post.id" :to="`/posts/${post.slug}`"
                  class="flex flex-col gap-1 rounded-sm border p-5 transition-colors hover:bg-accent">
                  <span v-if="post.publishedAt" class="text-xs text-muted-foreground">{{ formatDate(post.publishedAt)
                    }}</span>
                  <h2 class="text-lg font-medium">
                    {{ post.title }}
                  </h2>
                  <p class="text-sm text-muted-foreground">
                    {{ post.excerpt }}
                  </p>
                </NuxtLink>
              </div>
              <p v-else class="text-muted-foreground">
                Nenhum post publicado ainda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'contato'" id="contato" key="contato"
        class="min-h-screen scroll-mt-8 pb-24 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
        <div class="flex flex-col items-center justify-center gap-4 text-left">
          <div class="md:ml-16 md:h-full">
            <div class="px-6 py-24 md:mx-auto md:w-3xl">
              <div class="flex flex-col items-start gap-4">
                <div class="flex items-center gap-2 justify-center">
                  <h1 class="text-2xl font-semibold">
                    Contato
                  </h1>
                </div>
                <p class="text-muted-foreground">
                  em construção
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'pagar-um-cafe'" id="pagar-um-cafe" key="pagar-um-cafe"
        class="min-h-screen scroll-mt-8 pb-24 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
        <div class="flex flex-col items-center justify-center gap-4 text-left">
          <div class="md:ml-16 md:h-full">
            <div class="px-6 py-24 md:mx-auto md:w-3xl">
              <div class="flex flex-col items-start gap-4">
                <div class="flex items-center gap-2 justify-center">
                  <h1 class="text-2xl font-semibold">
                    Pagar um café
                  </h1>
                </div>
                <p class="text-muted-foreground">
                  Tem um problema técnico ou uma dúvida de arquitetura e quer trocar uma ideia? Descreva o que você
                  precisa
                  e a gente marca um café (virtual) para conversar sobre o diagnóstico e possíveis formas de resolver.
                </p>
                <NuxtLink to="/pagar-um-cafe">
                  <Button>Pagar um café</Button>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.section-fade-enter-active,
.section-fade-leave-active {
  transition: opacity 0.2s ease;
}

.section-fade-enter-from,
.section-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {

  .section-fade-enter-active,
  .section-fade-leave-active {
    transition: none;
  }
}
</style>
