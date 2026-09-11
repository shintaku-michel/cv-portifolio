<script setup lang="ts">
import type { Certificate, CertificateCategory, CertificateInput } from '#shared/types/certificate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
  initialCertificate?: Certificate
  submitting: boolean
}>()

const emit = defineEmits<{
  submit: [input: CertificateInput]
}>()

const CATEGORY_LABELS: Record<CertificateCategory, string> = {
  DESENVOLVIMENTO_WEB: 'Desenvolvimento Web',
  UX_UI_DESIGN: 'UX/UI Design',
  DEVOPS: 'DevOps',
  BACKEND: 'Backend',
  GESTAO_DE_PROJETOS: 'Gestão de Projetos'
}
const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS) as CertificateCategory[]

const title = ref(props.initialCertificate?.title ?? '')
const description = ref(props.initialCertificate?.description ?? '')
const category = ref<CertificateCategory>(props.initialCertificate?.category ?? 'DESENVOLVIMENTO_WEB')
const completedAt = ref(props.initialCertificate?.completedAt ?? '')
const image = ref(props.initialCertificate?.image ?? '')
const onlineUrl = ref(props.initialCertificate?.onlineUrl ?? '')
const displayOrder = ref(props.initialCertificate?.displayOrder ?? 0)

function onSubmit() {
  emit('submit', {
    title: title.value,
    description: description.value,
    category: category.value,
    completedAt: completedAt.value,
    image: image.value || null,
    onlineUrl: onlineUrl.value || null,
    displayOrder: displayOrder.value
  })
}
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <div class="flex flex-col gap-2">
      <Label for="title">Título</Label>
      <Input id="title" v-model="title" required />
    </div>

    <div class="flex flex-col gap-2">
      <Label for="description">Descrição</Label>
      <Textarea id="description" v-model="description" rows="4" required />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <Label>Categoria</Label>
        <Select v-model="category">
          <SelectTrigger class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="option in CATEGORY_OPTIONS" :key="option" :value="option">
              {{ CATEGORY_LABELS[option] }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex flex-col gap-2">
        <Label for="completedAt">Concluído em</Label>
        <Input id="completedAt" v-model="completedAt" type="date" required />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <Label for="image">Imagem do certificado (URL ou caminho local, ex.: /certificados/arquivo.png)</Label>
      <Input id="image" v-model="image" type="text" placeholder="https://... ou /certificados/arquivo.png" />
    </div>

    <div class="flex flex-col gap-2">
      <Label for="onlineUrl">Link de verificação online</Label>
      <Input id="onlineUrl" v-model="onlineUrl" type="url" placeholder="https://..." />
    </div>

    <div class="flex flex-col gap-2">
      <Label for="displayOrder">Ordem de exibição</Label>
      <Input id="displayOrder" v-model.number="displayOrder" type="number" />
    </div>

    <Button type="submit" :disabled="submitting" class="self-start">
      {{ submitting ? 'Salvando…' : 'Salvar' }}
    </Button>
  </form>
</template>
