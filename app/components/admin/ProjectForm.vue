<script setup lang="ts">
import type { Project, ProjectInput, Technology, TechnologyCategory } from '#shared/types/project'
import { slugify } from '#shared/utils/slug'
import RichTextEditor from '@/components/admin/RichTextEditor.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
  initialProject?: Project
  technologies: Technology[]
  submitting: boolean
}>()

// Ordem de exibição dos grupos no formulário.
const TECHNOLOGY_CATEGORY_LABELS: Record<TechnologyCategory, string> = {
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  API: 'APIs & Comunicação',
  DATABASE: 'Banco de Dados',
  ORM: 'ORM & Persistência',
  CLOUD: 'Cloud & Deploy',
  DEVOPS: 'DevOps & CI/CD',
  BUILD_TOOLS: 'Build & Dependências',
  TESTING: 'Testes',
  AI: 'IA',
  SECURITY: 'Segurança & Autenticação',
  PAYMENTS: 'Pagamentos',
  ARCHITECTURE: 'Arquitetura & Padrões',
  INFRASTRUCTURE: 'Servidores & Infraestrutura',
  VERSION_CONTROL: 'Versionamento & Repositórios',
  OBSERVABILITY: 'Observabilidade'
}
const TECHNOLOGY_CATEGORY_ORDER = Object.keys(TECHNOLOGY_CATEGORY_LABELS) as TechnologyCategory[]

const technologiesByCategory = computed(() => {
  return TECHNOLOGY_CATEGORY_ORDER
    .map(category => ({
      category,
      label: TECHNOLOGY_CATEGORY_LABELS[category],
      technologies: props.technologies.filter(tech => tech.category === category)
    }))
    .filter(group => group.technologies.length > 0)
})

const emit = defineEmits<{
  submit: [input: ProjectInput]
}>()

const title = ref(props.initialProject?.title ?? '')
const slug = ref(props.initialProject?.slug ?? '')
const shortDescription = ref(props.initialProject?.shortDescription ?? '')
const description = ref(props.initialProject?.description ?? '')
const coverImage = ref(props.initialProject?.coverImage ?? '')
const galleryText = ref(props.initialProject?.gallery?.join('\n') ?? '')
const demoUrl = ref(props.initialProject?.demoUrl ?? '')
const repositoryUrl = ref(props.initialProject?.repositoryUrl ?? '')
const startDate = ref(props.initialProject?.startDate ?? '')
const endDate = ref(props.initialProject?.endDate ?? '')
const featured = ref(props.initialProject?.featured ?? false)
const isOnline = ref(props.initialProject?.isOnline ?? false)
const displayOrder = ref(props.initialProject?.displayOrder ?? 0)
const selectedTechnologyIds = ref(new Set(props.initialProject?.technologies.map(t => t.id) ?? []))

function selectedCount(categoryTechnologies: Technology[]) {
  return categoryTechnologies.filter(tech => selectedTechnologyIds.value.has(tech.id)).length
}

// Ao editar um projeto, abre de cara os grupos que já têm alguma tecnologia
// marcada — o resto some atrás do collapsible pra reduzir o scroll da tela.
const defaultOpenCategories = technologiesByCategory.value
  .filter(group => group.technologies.some(tech => selectedTechnologyIds.value.has(tech.id)))
  .map(group => group.category)

// Slug segue o título automaticamente até o admin editá-lo manualmente.
const slugEditedManually = ref(Boolean(props.initialProject))
watch(title, (value) => {
  if (!slugEditedManually.value) {
    slug.value = slugify(value)
  }
})
function onSlugInput() {
  slugEditedManually.value = true
}

function toggleTechnology(id: string, checked: boolean) {
  if (checked) {
    selectedTechnologyIds.value.add(id)
  } else {
    selectedTechnologyIds.value.delete(id)
  }
}

function onSubmit() {
  emit('submit', {
    title: title.value,
    slug: slug.value,
    shortDescription: shortDescription.value,
    description: description.value,
    coverImage: coverImage.value || null,
    gallery: galleryText.value.split('\n').map(line => line.trim()).filter(Boolean),
    demoUrl: demoUrl.value || null,
    repositoryUrl: repositoryUrl.value || null,
    startDate: startDate.value || null,
    endDate: endDate.value || null,
    featured: featured.value,
    isOnline: isOnline.value,
    displayOrder: displayOrder.value,
    technologyIds: [...selectedTechnologyIds.value]
  })
}
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <Label for="title">Título</Label>
        <Input id="title" v-model="title" required />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="slug">Slug</Label>
        <Input id="slug" v-model="slug" required @input="onSlugInput" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <Label for="shortDescription">Descrição curta</Label>
      <Textarea id="shortDescription" v-model="shortDescription" rows="2" required />
    </div>

    <div class="flex flex-col gap-2">
      <Label for="description">Descrição completa</Label>
      <RichTextEditor id="description" v-model="description" placeholder="Descreva o projeto em detalhes…" />
    </div>

    <div class="flex flex-col gap-2">
      <Label for="coverImage">Imagem de capa (URL ou caminho local, ex.: /projetos/arquivo.png)</Label>
      <Input id="coverImage" v-model="coverImage" type="text" placeholder="https://... ou /projetos/arquivo.png" />
    </div>

    <div class="flex flex-col gap-2">
      <Label for="gallery">Galeria (uma URL por linha)</Label>
      <Textarea id="gallery" v-model="galleryText" rows="3" placeholder="https://...&#10;https://..." />
    </div>

    <fieldset class="flex flex-col gap-1">
      <legend class="mb-1 text-sm font-medium">
        Tecnologias utilizadas
      </legend>
      <Accordion type="multiple" :default-value="defaultOpenCategories">
        <AccordionItem v-for="group in technologiesByCategory" :key="group.category" :value="group.category">
          <AccordionTrigger>
            <div class="flex items-center">
              {{ group.label }}
              <span class="ml-2 text-xs font-normal text-muted-foreground">
                ({{ selectedCount(group.technologies) }}/{{ group.technologies.length }})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div class="flex flex-wrap gap-4">
              <label v-for="tech in group.technologies" :key="tech.id" class="flex items-center gap-2 text-sm">
                <Checkbox :model-value="selectedTechnologyIds.has(tech.id)"
                  @update:model-value="checked => toggleTechnology(tech.id, checked === true)" />
                {{ tech.name }}
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </fieldset>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <Label for="demoUrl">URL da demonstração</Label>
        <Input id="demoUrl" v-model="demoUrl" type="url" placeholder="https://..." />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="repositoryUrl">URL do repositório</Label>
        <Input id="repositoryUrl" v-model="repositoryUrl" type="url" placeholder="https://..." />
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <Label for="startDate">Data inicial</Label>
        <Input id="startDate" v-model="startDate" type="date" />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="endDate">Data final</Label>
        <Input id="endDate" v-model="endDate" type="date" />
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="flex items-center gap-2">
        <Switch id="featured" :model-value="featured" @update:model-value="(v: boolean) => (featured = v)" />
        <Label for="featured">{{ featured ? 'Destaque' : 'Sem destaque' }}</Label>
      </div>
      <div class="flex items-center gap-2">
        <Switch id="isOnline" :model-value="isOnline" @update:model-value="(v: boolean) => (isOnline = v)" />
        <Label for="isOnline">{{ isOnline ? 'Online' : 'Offline' }}</Label>
      </div>
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
