<script setup lang="ts">
import type { Certificate, CertificateCategory } from '#shared/types/certificate'
import CertificateCard from '@/components/certificates/CertificateCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { MoveLeft } from '@lucide/vue'

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
      id title description category completedAt image onlineUrl displayOrder
    }
  }
`

const { data, pending, error } = await useAsyncData('certificados', () =>
  useGraphQL<{ certificates: Certificate[] }>(QUERY)
)

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const certificatesView = computed(() => (data.value?.certificates ?? []).map(certificate => ({
  ...certificate,
  categoryLabel: CATEGORY_LABELS[certificate.category],
  completedAtLabel: formatDate(certificate.completedAt)
})))

// Duas colunas independentes (par/ímpar) em vez de CSS columns: preserva a
// ordem de leitura esquerda-para-direita (1 2 / 3 4 / 5 6) enquanto cada
// coluna ainda se ajusta à própria altura, sem esperar a coluna vizinha.
const leftColumn = computed(() => certificatesView.value.filter((_, index) => index % 2 === 0))
const rightColumn = computed(() => certificatesView.value.filter((_, index) => index % 2 === 1))

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

    <template v-else>
      <!-- Mobile: uma coluna só, ordem sequencial normal. -->
      <div class="flex flex-col gap-6 sm:hidden">
        <CertificateCard
          v-for="certificate in certificatesView" :key="certificate.id" :certificate="certificate"
          :category-label="certificate.categoryLabel" :completed-at-label="certificate.completedAtLabel"
          @view="openCertificateId = $event"
        />
      </div>

      <!-- sm+: duas colunas, cada uma com seu próprio fluxo vertical. -->
      <div class="hidden gap-6 sm:grid sm:grid-cols-2">
        <div class="flex flex-col gap-6">
          <CertificateCard
            v-for="certificate in leftColumn" :key="certificate.id" :certificate="certificate"
            :category-label="certificate.categoryLabel" :completed-at-label="certificate.completedAtLabel"
            @view="openCertificateId = $event"
          />
        </div>
        <div class="flex flex-col gap-6">
          <CertificateCard
            v-for="certificate in rightColumn" :key="certificate.id" :certificate="certificate"
            :category-label="certificate.categoryLabel" :completed-at-label="certificate.completedAtLabel"
            @view="openCertificateId = $event"
          />
        </div>
      </div>
    </template>

    <Dialog :open="!!openCertificate" @update:open="(open) => { if (!open) openCertificateId = null }">
      <DialogContent v-if="openCertificate" class="sm:max-w-3xl">
        <DialogTitle>Certificado — {{ openCertificate.title }}</DialogTitle>
        <img v-if="openCertificate.image" :src="openCertificate.image" :alt="`Certificado — ${openCertificate.title}`"
          class="w-full rounded-sm">
      </DialogContent>
    </Dialog>
  </div>
</template>
