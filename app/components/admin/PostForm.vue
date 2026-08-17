<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { slugify } from '#shared/utils/slug'
import type { Category, Post, PostInput, Tag } from '#shared/types/post'

const props = defineProps<{
  initialPost?: Post
  categories: Category[]
  tags: Tag[]
  submitting: boolean
}>()

const emit = defineEmits<{
  submit: [input: PostInput]
}>()

const title = ref(props.initialPost?.title ?? '')
const slug = ref(props.initialPost?.slug ?? '')
const excerpt = ref(props.initialPost?.excerpt ?? '')
const content = ref(props.initialPost?.content ?? '')
const coverImage = ref(props.initialPost?.coverImage ?? '')

// reka-ui's Select não aceita value="" para itens — usa um sentinel.
const NO_CATEGORY = 'none'
const categoryId = ref(props.initialPost?.category?.id ?? NO_CATEGORY)
const selectedTagIds = ref(new Set(props.initialPost?.tags.map(t => t.id) ?? []))

// Slug segue o título automaticamente até o admin editá-lo manualmente.
const slugEditedManually = ref(Boolean(props.initialPost))
watch(title, (value) => {
  if (!slugEditedManually.value) {
    slug.value = slugify(value)
  }
})
function onSlugInput() {
  slugEditedManually.value = true
}

function toggleTag(id: string, checked: boolean) {
  if (checked) {
    selectedTagIds.value.add(id)
  } else {
    selectedTagIds.value.delete(id)
  }
}

function onSubmit() {
  emit('submit', {
    title: title.value,
    slug: slug.value,
    excerpt: excerpt.value,
    content: content.value,
    coverImage: coverImage.value || null,
    categoryId: categoryId.value === NO_CATEGORY ? null : categoryId.value,
    tagIds: [...selectedTagIds.value]
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
      <Label for="excerpt">Resumo</Label>
      <Textarea id="excerpt" v-model="excerpt" rows="2" required />
    </div>

    <div class="flex flex-col gap-2">
      <Label for="content">Conteúdo (Markdown)</Label>
      <Textarea id="content" v-model="content" rows="14" required class="font-mono text-sm" />
    </div>

    <div class="flex flex-col gap-2">
      <Label for="coverImage">Imagem de capa (URL)</Label>
      <Input id="coverImage" v-model="coverImage" type="url" placeholder="https://..." />
    </div>

    <div class="flex flex-col gap-2">
      <Label>Categoria</Label>
      <Select v-model="categoryId">
        <SelectTrigger class="w-full sm:w-64">
          <SelectValue placeholder="Sem categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="NO_CATEGORY">
            Sem categoria
          </SelectItem>
          <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <fieldset class="flex flex-col gap-2">
      <legend class="mb-1 text-sm font-medium">
        Tags
      </legend>
      <div class="flex flex-wrap gap-4">
        <label
          v-for="tag in tags"
          :key="tag.id"
          class="flex items-center gap-2 text-sm"
        >
          <Checkbox
            :model-value="selectedTagIds.has(tag.id)"
            @update:model-value="checked => toggleTag(tag.id, checked === true)"
          />
          {{ tag.name }}
        </label>
      </div>
    </fieldset>

    <Button type="submit" :disabled="submitting" class="self-start">
      {{ submitting ? 'Salvando…' : 'Salvar' }}
    </Button>
  </form>
</template>
