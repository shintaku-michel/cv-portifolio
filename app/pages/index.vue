<script setup lang="ts">
import type { Post } from '#shared/types/post'
import type { Project } from '#shared/types/project'
import michelDark from '@/assets/img/michel-dark.png'
import michelLight from '@/assets/img/michel-light.png'
import RevealMask from '@/components/common/RevealMask.vue'
import TechMarquee from '@/components/common/TechMarquee.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Code2Icon, CoffeeIcon } from '@lucide/vue'

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
const route = useRoute()
const activeSection = computed(() => (route.hash ? route.hash.slice(1) : 'inicio'))

// Avatar troca de foto junto com o tema global (claro/escuro).
const { theme } = useTheme()
const avatarSrc = computed(() => (theme.value === 'dark' ? michelDark : michelLight))
</script>

<template>
  <div class="flex flex-col gap-24">
    <Transition name="section-fade" mode="out-in">
      <section v-if="activeSection === 'inicio'" id="inicio" key="inicio" class="h-dvh">
        <!-- TODO: passar background-src assim que a imagem estiver pronta,
             ex: background-src="/img/reveal-inicio.jpg" -->
        <RevealMask class="flex flex-col items-center justify-center gap-4 text-center">
          <div class="relative">
            <div class="relative h-32 w-32 overflow-hidden rounded-full ring-3 ring-[#aaaaaa]">
              <img :src="avatarSrc" alt="michel shintaku">
            </div>
            <div
              class="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-white ring-1 ring-[#999999]">
              <Code2Icon class="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <p class="max-w-3xl text-muted-foreground">
            こんにちは世界! Meu nome é Michel
          </p>
          <h1 class="text-3xl font-semibold">
            Desenvolvedor Fullstack
          </h1>
          <p class="max-w-3xl text-muted-foreground">
            Crio produtos digitais que unem tecnologia e estratégia, com foco no usuário, transformando necessidades reais
            em soluções inovadoras e alinhadas aos objetivos do negócio.
          </p>

          <TechMarquee class="max-w-3xl" />
        </RevealMask>
      </section>

      <section v-else-if="activeSection === 'perfil'" id="perfil" key="perfil"
        class="flex h-dvh flex-col items-center justify-start gap-4 mt-32">
        <div class="w-full max-w-3xl">
          <h1 class="mb-4 text-left text-2xl font-semibold">
            Perfil
          </h1>

          <p class="text-muted-foreground mb-4">
            Nasci em Goiânia e cresci em Brasília. Desde cedo tive contato com a arte.
            O design, a música, a tecnologia e a cultura japonesa são influências que fizeram parte da minha formação e
            ajudaram a moldar quem sou hoje.
          </p>

          <p class="text-muted-foreground mb-4">
            Mais tarde, tive a oportunidade de morar por quase uma década no Japão, experiência que aprofundou minha
            compreensão sobre disciplina, honestidade, organização, resiliência e senso de coletividade. Essa vivência
            ampliou minha visão de mundo e fortaleceu valores que hoje fazem parte da minha vida.
          </p>

          <p class="text-muted-foreground">
            Hoje, sou desenvolvedor Full Stack e tenho mais de 18 anos de experiência na criação de produtos digitais.
            Minha jornada na tecnologia começou em 2005 e, desde 2007, atuo profissionalmente desenvolvendo soluções
            que buscam equilibrar experiência do usuário, acessibilidade e regras de negócio.
          </p>
        </div>
      </section>

      <section v-else-if="activeSection === 'valores'" id="valores" key="valores"
        class="flex h-dvh flex-col items-center justify-start gap-4 mt-32">
        <div class="w-full max-w-3xl">
          <h1 class="mb-4 text-2xl font-semibold">
            Valores
          </h1>
          <p class="text-muted-foreground mb-4">
            Acredito que um bom trabalho começa com planejamento, disciplina e aprendizado contínuo. A tecnologia está
            sempre mudando, e acompanhar essa evolução faz parte do nosso trabalho. Aprender, experimentar e estar
            disposto a mudar também são formas de evoluir.
          </p>

          <p class="text-muted-foreground mb-4">
            Prefiro a comunicação direta e honesta. Problemas devem ser compartilhados o quanto antes, antes que se
            tornem
            maiores. Questionar, pedir ajuda, ouvir diferentes perspectivas e compartilhar conhecimento também fazem
            parte
            do trabalho em equipe.
          </p>

          <p class="text-muted-foreground max-w-3xl">
            A inspiração pode iniciar uma ideia, mas é a consistência que a transforma em resultado. Pequenos avanços,
            repetidos ao longo do tempo, fazem as coisas acontecerem. Os desafios fazem parte do processo, e
            enfrentá-los
            com paciência e persistência também faz parte do trabalho.
          </p>
        </div>
      </section>

      <section v-else-if="activeSection === 'formacao'" id="formacao" key="formacao"
        class="flex h-dvh flex-col items-center justify-center gap-4 text-left">
        <h1 class="mb-4 text-2xl font-semibold">
          Formação
        </h1>
        <p class="text-muted-foreground max-w-3xl">
          Sou graduado em Ciência da Computação pelo Centro Universitário de Brasília (CEUB) e pós-graduado em Full
          Stack & IA pela Faculdade de Tecnologia Rocketseat. Minha formação, somada a mais de 18 anos de experiência
          prática no desenvolvimento web, me permite unir fundamentos de computação, desenvolvimento de software e
          o uso das tecnologias mais adequadas para criar cada solução digital.
        </p>
        <p class="text-muted-foreground max-w-3xl">
          Ao longo da minha trajetória, mantenho o hábito de continuar estudando, experimentando novas tecnologias e
          aprofundando conhecimentos que possam contribuir para a
          qualidade do meu trabalho.
        </p>
      </section>

      <section v-else-if="activeSection === 'cursos'" id="cursos" key="cursos"
        class="flex h-dvh flex-col items-center justify-center gap-4 text-left">
        <h1 class="mb-4 text-2xl font-semibold">
          Cursos
        </h1>
        <p class="text-muted-foreground max-w-3xl">
          Ao longo da minha carreira, busquei ampliar meus conhecimentos em diferentes áreas do desenvolvimento de
          software. Tenho cursos em UX/UI Design, acessibilidade (A11y), Frontend, Backend e DevOps. Sempre fui muito
          curioso e procurei entender diferentes partes do processo de desenvolvimento para ter mais autonomia, explorar
          novas possibilidades e não ficar limitado por uma única área da tecnologia.
        </p>
        <p class="text-muted-foreground max-w-3xl">
          Mais do que acumular certificados, busco conhecimentos que possam ser aplicados na prática e que me ajudem a
          compreender melhor todo o processo de criação dos produtos digitais que desenvolvo.
        </p>
      </section>

      <section v-else-if="activeSection === 'experiencia'" id="experiencia" key="experiencia"
        class="flex h-dvh flex-col items-center justify-center gap-4 text-left">
        <h1 class="mb-4 text-2xl font-semibold">
          Experiência
        </h1>
        <p class="text-muted-foreground max-w-3xl">
          Sempre fui muito curioso e gosto de entender como as coisas funcionam. Ao longo da minha carreira, fiz cursos
          em diferentes áreas do desenvolvimento web, como UX/UI Design, acessibilidade (A11y), Frontend, Backend e
          DevOps. Essa busca por conhecimentos diversos sempre teve um propósito: ter mais autonomia para transformar
          ideias em soluções e não ficar limitado por uma única área da tecnologia. Também tive a oportunidade de
          compartilhar conhecimento como professor de Engenharia de Software e Informática no IFB, experiência que
          ampliou ainda mais minha forma de aprender e ensinar.
        </p>
        <p class="text-muted-foreground max-w-3xl">
          Comecei minha carreira no Backend, onde aprendi a construir APIs, trabalhar com segurança, padrões de
          desenvolvimento e arquitetura de software. Foi em uma época em que desenvolver em Java exigia conhecer muito
          mais do que a linguagem: era preciso entender configuração, empacotamento e toda a infraestrutura necessária
          para colocar uma aplicação para funcionar, usando tecnologias como Spring, Hibernate, Tomcat ou JBoss, além do
          Angular no frontend. Mas minha curiosidade acabou me levando também para o Frontend, uma área em que comecei a
          me destacar. Talvez isso tenha relação com minha história, minha cultura e meu interesse por arte e pelo
          processo de criação.
        </p>
        <p class="text-muted-foreground max-w-3xl">
          Em uma das fábricas de software por onde passei, tive a oportunidade de liderar um time de Frontend e me
          aprofundei ainda mais nessa camada que admiro tanto. Também me aproximei de UX, uma área que considero
          fundamental para criar produtos melhores — e que renderia muitas horas de conversa. Mais tarde, ao voltar para
          o Backend, dessa vez com Node.js, percebi o quanto essa experiência em Frontend havia ampliado minha visão:
          passei a criar APIs mais amigáveis e fáceis de consumir e, principalmente, a enxergar o desenvolvimento de
          forma mais completa. Hoje, continuo estudando e experimentando novas tecnologias e práticas, sempre buscando
          evoluir e encontrar formas melhores de transformar ideias em soluções.
        </p>
      </section>

      <section v-else-if="activeSection === 'projetos'" id="projetos" key="projetos" class="scroll-mt-8">
        <div class="mb-6 flex items-center justify-between">
          <h1 class="text-2xl font-semibold">
            Projetos em destaque
          </h1>
          <NuxtLink to="/projetos" class="text-sm text-muted-foreground hover:underline">
            Ver todos
          </NuxtLink>
        </div>

        <div v-if="projectsData?.featuredProjects.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink v-for="project in projectsData.featuredProjects" :key="project.id" :to="`/projetos/${project.slug}`"
            class="flex flex-col gap-3 rounded-lg border p-5 transition-colors hover:bg-accent">
            <img v-if="project.coverImage" :src="project.coverImage" :alt="project.title"
              class="aspect-video w-full rounded-md object-cover">
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
      </section>

      <section v-else-if="activeSection === 'blog'" id="blog" key="blog" class="scroll-mt-8">
        <div class="mb-6 flex items-center justify-between">
          <h1 class="text-2xl font-semibold">
            Blog
          </h1>
          <NuxtLink to="/posts" class="text-sm text-muted-foreground hover:underline">
            Ver todos
          </NuxtLink>
        </div>

        <div v-if="latestPosts.length" class="flex flex-col gap-4">
          <NuxtLink v-for="post in latestPosts" :key="post.id" :to="`/posts/${post.slug}`"
            class="flex flex-col gap-1 rounded-lg border p-5 transition-colors hover:bg-accent">
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
      </section>

      <section v-else-if="activeSection === 'contato'" id="contato" key="contato" class="scroll-mt-8">
        <h1 class="mb-4 text-2xl font-semibold">
          Contato
        </h1>
        <p class="text-muted-foreground">
          Em construção.
        </p>
      </section>

      <section v-else-if="activeSection === 'pagar-um-cafe'" id="pagar-um-cafe" key="pagar-um-cafe"
        class="scroll-mt-8 pb-24">
        <div class="flex flex-col items-start gap-4 rounded-lg border p-8">
          <CoffeeIcon class="size-8 text-muted-foreground" />
          <h1 class="text-2xl font-semibold">
            Pagar um café
          </h1>
          <p class="max-w-2xl text-muted-foreground">
            Tem um problema técnico ou uma dúvida de arquitetura e quer trocar uma ideia? Descreva o que você precisa
            e a gente marca um café (virtual) para conversar sobre o diagnóstico e possíveis formas de resolver.
          </p>
          <NuxtLink to="/pagar-um-cafe">
            <Button>Pagar um café</Button>
          </NuxtLink>
        </div>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.section-fade-enter-active,
.section-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.section-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.section-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {

  .section-fade-enter-active,
  .section-fade-leave-active {
    transition: none;
  }
}
</style>
