<script setup lang="ts">
import type { Certificate, CertificateCategory } from '#shared/types/certificate'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
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

const CATEGORY_LABELS: Record<CertificateCategory, string> = {
  DESENVOLVIMENTO_WEB: 'Desenvolvimento Web',
  UX_UI_DESIGN: 'UX/UI Design',
  DEVOPS: 'DevOps',
  BACKEND: 'Backend',
  GESTAO_DE_PROJETOS: 'Gestão de Projetos'
}

const QUERY = `
  query PublicCertificates {
    certificates {
      id title description category completedAt image onlineUrl
    }
  }
`

const { data, pending, error } = await useAsyncData('certificados', () =>
  useGraphQL<{ certificates: Certificate[] }>(QUERY)
)

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const openCertificateId = ref<string | null>(null)
const openCertificate = computed(() =>
  data.value?.certificates.find(c => c.id === openCertificateId.value) ?? null)
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
          Certificados <span v-if="data?.certificates.length" class="text-sm">( {{ data.certificates.length }} )</span>
        </h1>
        <p class="font-cursive text-xl text-muted-foreground leading-5 mt-1">
          Certificados e cursos complementares que fiz ao longo da carreira.
        </p>
      </div>
    </div>

    <LoadingState v-if="pending" />
    <ErrorState v-else-if="error" message="Não foi possível carregar os certificados." />
    <EmptyState v-else-if="!data?.certificates.length" message="Nenhum certificado cadastrado ainda." />

    <div v-else class="gap-6 sm:columns-2">
      <Card v-for="certificate in data.certificates" :key="certificate.id" class="mb-6 break-inside-avoid">
        <CardHeader>
          <CardTitle>{{ certificate.title }}</CardTitle>
          <span class="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays class="h-3.5 w-3.5" />
            Concluído em {{ formatDate(certificate.completedAt) }}
          </span>
          <span class="flex items-center gap-2 text-xs text-muted-foreground">
            <GraduationCap class="h-3.5 w-3.5" />
            {{ CATEGORY_LABELS[certificate.category] }}
          </span>
        </CardHeader>
        <CardContent class="flex flex-col gap-3">
          <CardDescription>{{ certificate.description }}</CardDescription>
        </CardContent>
        <CardFooter class="flex flex-wrap gap-2">
          <Button size="sm" :disabled="!certificate.image" @click="openCertificateId = certificate.id">
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

    <Dialog :open="!!openCertificate" @update:open="(open) => { if (!open) openCertificateId = null }">
      <DialogContent v-if="openCertificate" class="sm:max-w-3xl">
        <DialogTitle>Certificado — {{ openCertificate.title }}</DialogTitle>
        <img v-if="openCertificate.image" :src="openCertificate.image" :alt="`Certificado — ${openCertificate.title}`"
          class="w-full rounded-sm">
      </DialogContent>
    </Dialog>
  </div>
</template>
