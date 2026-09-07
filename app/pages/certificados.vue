<script setup lang="ts">
import certificadoFigma from '@/assets/img/certificado-figma.png'
import certificadoFullStack from '@/assets/img/dev-web-full-stack.png'
import certificadoDevOps from '@/assets/img/devOps-02.png'
import certificadoNodejs from '@/assets/img/nodejs.png'
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
          Certificados
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
