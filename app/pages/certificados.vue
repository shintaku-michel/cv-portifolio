<script setup lang="ts">
import certificadoFigma from '@/assets/img/certificados/certificado-figma.png'
import certificadoCoordenador from '@/assets/img/certificados/coordenador.png'
import certificadoDesignerGrafico from '@/assets/img/certificados/designer-grafico.png'
import certificadoFullStack from '@/assets/img/certificados/dev-web-full-stack.png'
import certificadoDesWeb from '@/assets/img/certificados/dev-web.png'
import certificadoDevOps from '@/assets/img/certificados/devOps-02.png'
import certificadoEspecializar from '@/assets/img/certificados/especializar.png'
import certificadoFundamentar from '@/assets/img/certificados/fundamentar.png'
import certificadoGerenciaDeProjetos from '@/assets/img/certificados/gerencia-de-projetos.png'
import certificadoJavaOO from '@/assets/img/certificados/java-oo.png'
import certificadoJavaTeste from '@/assets/img/certificados/java-testes.png'
import certificadoJavaWeb from '@/assets/img/certificados/java-web.png'
import certificadoJava from '@/assets/img/certificados/java.png'
import certificadoExpress from '@/assets/img/certificados/node-express.png'
import certificadoNodeMongo from '@/assets/img/certificados/nodejs-mongo.png'
import certificadoNodejs from '@/assets/img/certificados/nodejs.png'
import certificadoInterfacesWebResponsivas from '@/assets/img/certificados/professor.png'
import certificadoPython from '@/assets/img/certificados/python.png'
import certificadoVue3 from '@/assets/img/certificados/vue3.png'
import certificadoVuejs from '@/assets/img/certificados/vuejs.png'
import certificadoWebDeveloper from '@/assets/img/certificados/web-developer.png'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { CalendarDays, ExternalLink, GraduationCap, MoveLeft, View } from '@lucide/vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Certificados',
  description: 'Certificados e cursos complementares em UX/UI Design, acessibilidade, Frontend, Backend e DevOps.',
  ogTitle: 'Certificados',
  ogUrl: `${requestUrl.origin}/certificados`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/certificados` }] })

interface Certificate {
  category: string
  title: string
  description: string
  completedAt: string
  image?: string
  onlineUrl?: string
}

const certificates: Certificate[] = [
  {
    title: 'Arquitetura de Software e Sistemas Escaláveis',
    description: 'Curso voltado a práticas avançadas de engenharia de software, abordando arquitetura, Design Patterns, testes, bancos de dados, microsserviços e Kubernetes, além da aplicação de Inteligência Artificial, gestão de projetos e inovação no desenvolvimento de soluções modernas.',
    completedAt: '09/02/2026',
    image: certificadoDevOps,
    category: 'DevOps',
    onlineUrl: 'https://app.rocketseat.com.br/certificates/ef1df7aa-c1bf-4d5b-8c37-f9125cc5b9be'
  },
  {
    title: 'Desenvolvimento Web Full Stack, Cloud, DevOps e IA',
    description: 'Desenvolvimento de aplicações modernas com foco em infraestrutura, deploy, produtividade e Inteligência Artificial.',
    completedAt: '13/10/2025',
    image: certificadoFullStack,
    category: 'DevOps',
    onlineUrl: 'https://app.rocketseat.com.br/certificates/bf3924fc-5956-43af-8661-d4799f0fe92a'
  },
  {
    title: 'Figma for Devs',
    description: 'Um curso de Figma para quem é dev front-end, a fim de te ensinar a como utilizar o Figma de forma produtiva na hora de migrar um projeto de UI para código HTML/CSS.',
    completedAt: '11/05/2026',
    image: certificadoFigma,
    category: 'UX/UI Design',
    onlineUrl: 'https://ftr.rocketseat.com.br/certificates/600d9c9f-fac3-44bc-8434-7aaf26ec366e'
  },
  {
    title: 'Node.js',
    description: 'Curso focado nos fundamentos do desenvolvimento Backend com Node.js. Explorando o funcionamento do protocolo HTTP, manipulação de requisições e respostas, headers, status codes, parâmetros e processamento de dados com Streams',
    completedAt: '22/12/2024',
    image: certificadoNodejs,
    category: 'Backend',
    onlineUrl: 'https://app.rocketseat.com.br/certificates/cd3f8afe-bf19-4992-b13a-2d22f35a03c5'
  },
  {
    title: 'Desenvolvimento de Software com IA Aplicada e Alta Performance',
    description: 'Curso voltado à construção e evolução de produtos digitais escaláveis, abordando gestão de projetos e riscos, observabilidade, privacidade de dados, estratégias de deploy e GraphQL, além do uso de Inteligência Artificial e dados na tomada de decisões',
    completedAt: '03/03/2026',
    image: certificadoDesWeb,
    category: 'Desenvolvimento Web',
    onlineUrl: 'https://app.rocketseat.com.br/certificates/f6741d91-5fcc-4954-870a-255d3d002f24'
  },
  {
    title: 'Rocketseat Especializar',
    description: 'Curso focado no desenvolvimento web moderno, abordando JavaScript assíncrono, consumo de APIs, fundamentos de React.js e TypeScript, além de SQL avançado, colaboração com GitHub e criação de interfaces com animações em CSS.',
    completedAt: '14/11/2022',
    image: certificadoEspecializar,
    category: 'Desenvolvimento Web',
    onlineUrl: 'https://app.rocketseat.com.br/certificates/0bc72566-f2ce-49e7-b1f7-10721b110f34'
  },
  {
    title: 'Rocketseat Fundamentar',
    description: 'Curso de formação em fundamentos do desenvolvimento de software, abordando HTML, CSS, JavaScript, Node.js e SQL, além de estruturas de dados, paradigmas de programação, Git, GitHub e fundamentos do protocolo HTTP.',
    completedAt: '15/03/2023',
    image: certificadoFundamentar,
    category: 'Desenvolvimento Web',
    onlineUrl: 'https://app.rocketseat.com.br/certificates/5186fdbe-b825-4bd2-bfb5-6d0b705a5d02'
  },
  {
    title: 'Curso Vue JS 2 - O Guia Completo (Vue Router & Vuex)',
    description: 'Curso completo de Vue.js 2, abordando desde os fundamentos do framework até a criação de aplicações web complexas com Vue Router e Vuex, incluindo práticas recomendadas e padrões de desenvolvimento.',
    completedAt: '18/09/2022',
    image: certificadoVuejs,
    category: 'Desenvolvimento Web',
    onlineUrl: 'https://www.udemy.com/certificate/UC-00518eeb-840f-4e62-abe2-c784e4a92ec1/'
  },
  {
    title: 'Curso Completo do Desenvolvedor NodeJS e MongoDB',
    description: 'Curso completo de Node.js e MongoDB, abordando desde os fundamentos do desenvolvimento backend até a criação de APIs RESTful e integração com bancos de dados NoSQL.',
    completedAt: '12/02/2019',
    image: certificadoNodeMongo,
    category: 'Desenvolvimento Web',
    onlineUrl: 'https://www.udemy.com/certificate/UC-WNHY1DVR/'
  },
  {
    title: 'Node.js Express Project - CMS and Shopping Cart with Paypal',
    description: 'Curso completo de Node.js e Express, abordando desde a criação de APIs RESTful até a implementação de um sistema de gerenciamento de conteúdo (CMS) e um carrinho de compras com integração ao Paypal.',
    completedAt: '15/03/2023',
    image: certificadoExpress,
    category: 'Desenvolvimento Web',
    onlineUrl: 'https://www.udemy.com/certificate/UC-43573517-241d-4af2-bce4-47c542200010/'
  },
  {
    title: 'Vue 3 full course in one day + helpful docs (Cheat Sheet)',
    description: 'Curso completo de Vue 3, abordando desde os fundamentos do framework até a criação de aplicações web complexas, incluindo práticas recomendadas e padrões de desenvolvimento.',
    completedAt: '18/06/2023',
    image: certificadoVue3,
    category: 'Desenvolvimento Web',
    onlineUrl: 'https://www.udemy.com/certificate/UC-2b9d7190-4465-4e5a-81ae-4870a99fc468/'
  },
  {
    title: 'Criando um Projeto com Interface Gráfica Utilizando a Linguagem Python',
    description: 'Curso introdutório de desenvolvimento com Python, abordando classes e métodos, encapsulamento, criação de bibliotecas e desenvolvimento de aplicações, incluindo a construção de interfaces com Kivy.',
    completedAt: '14/06/2023',
    image: certificadoPython,
    category: 'Desenvolvimento Web',
    onlineUrl: ''
  },
  {
    title: 'Linguagem de Programação Java - Avançado',
    description: 'Os fundamentos da Programação Orientada a Objetos (POO) serão evidenciados, passando pelos objetos, as classes, suas construções, além dos complementos da linguagem Java, incluindo conceitos, como pacotes, métodos e herança.',
    completedAt: '14/06/2023',
    image: certificadoJava,
    category: 'Desenvolvimento Web',
    onlineUrl: ''
  },
  {
    title: 'Web Developer',
    description: 'Curso de formação em desenvolvimento web pelo SENAI, abordando os fundamentos para criação de aplicações e páginas web, com foco em programação, estruturação de interfaces e principais tecnologias utilizadas no desenvolvimento para a web.',
    completedAt: '26/05/2008',
    image: certificadoWebDeveloper,
    category: 'Desenvolvimento Web',
    onlineUrl: ''
  },
  {
    title: 'Designer Gráfico Aplicativos e Projetos',
    description: 'Curso de formação em design gráfico, abordando os fundamentos para criação de interfaces e experiências visuais em aplicações e projetos digitais.',
    completedAt: '07/06/2005',
    image: certificadoDesignerGrafico,
    category: 'Desenvolvimento Web',
    onlineUrl: ''
  },
  {
    title: 'Gerência de Projetos PMBOK',
    description: 'Curso de formação em gerenciamento de projetos, abordando as melhores práticas e diretrizes do PMBOK, incluindo planejamento, execução e controle de projetos.',
    completedAt: '24/02/2011',
    image: certificadoGerenciaDeProjetos,
    category: 'Desenvolvimento Web',
    onlineUrl: ''
  },
  {
    title: 'Java Orientado a Objetos',
    description: 'Curso de formação em Java, abordando os fundamentos da Programação Orientada a Objetos (POO), incluindo classes, objetos, herança e polimorfismo.',
    completedAt: '30/12/2010',
    image: certificadoJavaOO,
    category: 'Desenvolvimento Web',
    onlineUrl: ''
  },
  {
    title: 'Java com Testes. XML e Design Patterns',
    description: 'Curso de formação em Java, abordando desenvolvimento de aplicações, testes, manipulação de XML e aplicação de Design Patterns.',
    completedAt: '04/12/2010',
    image: certificadoJavaTeste,
    category: 'Desenvolvimento Web',
    onlineUrl: ''
  },
  {
    title: 'Java para desenvolvimento Web',
    description: 'Curso de formação em Java para desenvolvimento Web, abordando a criação de aplicações, integração com bancos de dados e fundamentos do ecossistema Java para Web.',
    completedAt: '26/03/2011',
    image: certificadoJavaWeb,
    category: 'Desenvolvimento Web',
    onlineUrl: ''
  },
  {
    title: 'IFTechDay - Interfaces Web Responsivas ',
    description: 'Minicurso sobre desenvolvimento de interfaces web responsivas, abordando técnicas e conceitos para criação de páginas adaptáveis a diferentes tamanhos de tela e dispositivos.',
    completedAt: '06/09/2013',
    image: certificadoInterfacesWebResponsivas,
    category: 'Gestão de Projetos',
    onlineUrl: ''
  },
  {
    title: 'IFTechDay - Coordenador Campus Brasília',
    description: 'Atuação na coordenação do IFTechDay no Campus Brasília, contribuindo para a organização e realização do evento, voltado à disseminação de conhecimento e à troca de experiências em tecnologia.',
    completedAt: '06/09/2013',
    image: certificadoCoordenador,
    category: 'Gestão de Projetos',
    onlineUrl: ''
  }
]

const openCertificateIndex = ref<number | null>(null)
const openCertificate = computed(() =>
  openCertificateIndex.value !== null ? certificates[openCertificateIndex.value] : null)
</script>

<template>
  <div class="p-6 md:mx-auto md:w-3xl">
    <NuxtLink to="/cursos" class="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:underline">
      <MoveLeft class="h-4 w-4" />
      Cursos
    </NuxtLink>

    <div class="mb-8 flex flex-col gap-3">
      <div>
        <h1 class="text-2xl font-semibold">
          Certificados <span class="text-sm">( {{ certificates.length }} )</span>
        </h1>
        <p class="font-cursive text-xl text-muted-foreground leading-5 mt-1">
          Certificados e cursos complementares que fiz ao longo da carreira.
        </p>
      </div>
    </div>

    <div class="gap-6 sm:columns-2">
      <Card v-for="(certificate, index) in certificates" :key="index" class="mb-6 break-inside-avoid">
        <CardHeader>
          <CardTitle>{{ certificate.title }}</CardTitle>
          <span class="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays class="h-3.5 w-3.5" />
            Concluído em {{ certificate.completedAt }}
          </span>
          <span class="flex items-center gap-2 text-xs text-muted-foreground">
            <GraduationCap class="h-3.5 w-3.5" />
            {{ certificate.category }}
          </span>
        </CardHeader>
        <CardContent class="flex flex-col gap-3">
          <CardDescription>{{ certificate.description }}</CardDescription>
        </CardContent>
        <CardFooter class="flex flex-wrap gap-2">
          <Button size="sm" :disabled="!certificate.image" @click="openCertificateIndex = index">
            <View />
            Visualizar
          </Button>
          <Button v-if="certificate.onlineUrl" as-child size="sm" variant="outline">
            <a :href="certificate.onlineUrl" target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              Certificado online
            </a>
          </Button>
          <span v-else class="px-4 text-muted-foreground">Sem certificado digital</span>
        </CardFooter>
      </Card>
    </div>

    <Dialog :open="!!openCertificate" @update:open="(open) => { if (!open) openCertificateIndex = null }">
      <DialogContent v-if="openCertificate" class="sm:max-w-3xl">
        <DialogTitle>Certificado — {{ openCertificate.title }}</DialogTitle>
        <img v-if="openCertificate.image" :src="openCertificate.image" :alt="`Certificado — ${openCertificate.title}`"
          class="w-full rounded-sm">
      </DialogContent>
    </Dialog>
  </div>
</template>
