<script setup lang="ts">
import certificadoFigma from '@/assets/img/certificado-figma.png'
import certificadoFullStack from '@/assets/img/dev-web-full-stack.png'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { CalendarDays, ExternalLink, MoveLeft, View } from '@lucide/vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Certificados',
  description: 'Certificados e cursos complementares em UX/UI Design, acessibilidade, Frontend, Backend e DevOps.',
  ogTitle: 'Certificados',
  ogUrl: `${requestUrl.origin}/certificados`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/certificados` }] })

interface Certificate {
  title: string
  description: string
  completedAt: string
  image?: string
  onlineUrl?: string
}

const certificates: Certificate[] = [
  {
    title: 'Figma for Devs',
    description: 'Um curso de Figma para quem é dev front-end, a fim de te ensinar a como utilizar o Figma de forma produtiva na hora de migrar um projeto de UI para código HTML/CSS.',
    completedAt: '11/05/2026',
    image: certificadoFigma,
    onlineUrl: 'https://ftr.rocketseat.com.br/certificates/600d9c9f-fac3-44bc-8434-7aaf26ec366e'
  },
  {
    title: 'Des. Web Full Stack, Cloud, DevOps e IA',
    description: 'Desenvolvimento de aplicações modernas com foco em infraestrutura, deploy, produtividade e Inteligência Artificial.',
    completedAt: '13/10/2025',
    image: certificadoFullStack,
    onlineUrl: 'https://app.rocketseat.com.br/certificates/bf3924fc-5956-43af-8661-d4799f0fe92a'
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

    <div class="grid gap-6 sm:grid-cols-2">
      <Card v-for="(certificate, index) in certificates" :key="index">
        <CardHeader>
          <CardTitle>{{ certificate.title }}</CardTitle>
          <span class="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays class="h-3.5 w-3.5" />
            Concluído em {{ certificate.completedAt }}
          </span>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 min-h-20">
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
