<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { slugify } from '#shared/utils/slug'
import type { Project, ProjectInput, Technology } from '#shared/types/project'

const props = defineProps<{
  initialProject?: Project
  technologies: Technology[]
  submitting: boolean
}>()

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
const displayOrder = ref(props.initialProject?.displayOrder ?? 0)
const selectedTechnologyIds = ref(new Set(props.initialProject?.technologies.map(t => t.id) ?? []))

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
      <Textarea id="description" v-model="description" rows="6" required />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <Label for="coverImage">Imagem de capa (URL)</Label>
        <Input id="coverImage" v-model="coverImage" type="url" placeholder="https://..." />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="gallery">Galeria (uma URL por linha)</Label>
        <Textarea id="gallery" v-model="galleryText" rows="3" placeholder="https://...&#10;https://..." />
      </div>
    </div>

    <fieldset class="flex flex-col gap-2">
      <legend class="mb-1 text-sm font-medium">
        Tecnologias
      </legend>
      <div class="flex flex-wrap gap-4">
        <label
          v-for="tech in technologies"
          :key="tech.id"
          class="flex items-center gap-2 text-sm"
        >
          <Checkbox
            :model-value="selectedTechnologyIds.has(tech.id)"
            @update:model-value="checked => toggleTechnology(tech.id, checked === true)"
          />
          {{ tech.name }}
        </label>
      </div>
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
        <Label for="featured">Projeto em destaque</Label>
      </div>
      <div class="flex flex-col gap-2">
        <Label for="displayOrder">Ordem de exibição</Label>
        <Input id="displayOrder" v-model.number="displayOrder" type="number" />
      </div>
    </div>

    <Button type="submit" :disabled="submitting" class="self-start">
      {{ submitting ? 'Salvando…' : 'Salvar' }}
    </Button>
  </form>
</template>
