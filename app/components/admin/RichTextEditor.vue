<script setup lang="ts">
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import {
  BoldIcon,
  Code2Icon,
  CodeIcon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Redo2Icon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon
} from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const props = defineProps<{
  modelValue: string
  id?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      // openOnClick: false porque durante a edição um clique deve
      // posicionar o cursor, não navegar para fora do editor.
      link: {
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' }
      }
    }),
    Placeholder.configure({ placeholder: props.placeholder ?? 'Escreva aqui…' })
  ],
  editorProps: {
    attributes: {
      ...(props.id ? { id: props.id } : {}),
      class: 'prose prose-neutral dark:prose-invert max-w-none min-h-40 px-3 py-2 focus:outline-none',
      'aria-multiline': 'true'
    }
  },
  onUpdate: ({ editor: instance }) => emit('update:modelValue', instance.getHTML())
})

onBeforeUnmount(() => editor.value?.destroy())

// O editor muda estado (negrito ativo, pode desfazer, etc.) fora da
// reatividade do Vue — sem isso os botões da toolbar nunca atualizariam
// o destaque de "ativo" enquanto o cursor se move ou o texto é digitado.
const updateTrigger = ref(0)
onMounted(() => {
  editor.value?.on('transaction', () => { updateTrigger.value++ })
})

const linkDialogOpen = ref(false)
const linkUrl = ref('')

function openLinkDialog() {
  linkUrl.value = editor.value?.getAttributes('link').href ?? ''
  linkDialogOpen.value = true
}

function applyLink() {
  const url = linkUrl.value.trim()
  if (!url) {
    editor.value?.chain().focus().unsetLink().run()
  } else {
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
  linkDialogOpen.value = false
}

function removeLink() {
  editor.value?.chain().focus().unsetLink().run()
  linkDialogOpen.value = false
}

interface ToolbarAction {
  label: string
  icon: typeof BoldIcon
  isActive: () => boolean
  run: () => void
}

// Agrupado visualmente (marcas de texto | títulos | listas/citação | link | histórico).
const toolbarGroups = computed<ToolbarAction[][]>(() => {
  void updateTrigger.value
  if (!editor.value) return []
  const instance = editor.value
  const chain = () => instance.chain().focus()

  return [
    [
      { label: 'Negrito', icon: BoldIcon, isActive: () => instance.isActive('bold'), run: () => chain().toggleBold().run() },
      { label: 'Itálico', icon: ItalicIcon, isActive: () => instance.isActive('italic'), run: () => chain().toggleItalic().run() },
      { label: 'Sublinhado', icon: UnderlineIcon, isActive: () => instance.isActive('underline'), run: () => chain().toggleUnderline().run() },
      { label: 'Tachado', icon: StrikethroughIcon, isActive: () => instance.isActive('strike'), run: () => chain().toggleStrike().run() },
      { label: 'Código', icon: CodeIcon, isActive: () => instance.isActive('code'), run: () => chain().toggleCode().run() }
    ],
    [
      { label: 'Título 2', icon: Heading2Icon, isActive: () => instance.isActive('heading', { level: 2 }), run: () => chain().toggleHeading({ level: 2 }).run() },
      { label: 'Título 3', icon: Heading3Icon, isActive: () => instance.isActive('heading', { level: 3 }), run: () => chain().toggleHeading({ level: 3 }).run() }
    ],
    [
      { label: 'Lista com marcadores', icon: ListIcon, isActive: () => instance.isActive('bulletList'), run: () => chain().toggleBulletList().run() },
      { label: 'Lista numerada', icon: ListOrderedIcon, isActive: () => instance.isActive('orderedList'), run: () => chain().toggleOrderedList().run() },
      { label: 'Citação', icon: QuoteIcon, isActive: () => instance.isActive('blockquote'), run: () => chain().toggleBlockquote().run() },
      { label: 'Bloco de código', icon: Code2Icon, isActive: () => instance.isActive('codeBlock'), run: () => chain().toggleCodeBlock().run() }
    ]
  ]
})
</script>

<template>
  <div
    class="flex flex-col rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
  >
    <div v-if="editor" class="flex flex-wrap items-center gap-0.5 border-b border-input p-1">
      <template v-for="(group, groupIndex) in toolbarGroups" :key="groupIndex">
        <div v-if="groupIndex > 0" class="mx-1 h-5 w-px bg-border" />
        <Button
          v-for="action in group"
          :key="action.label"
          type="button"
          variant="ghost"
          size="icon"
          class="size-8"
          :class="action.isActive() ? 'bg-muted text-foreground' : 'text-muted-foreground'"
          :aria-pressed="action.isActive()"
          :aria-label="action.label"
          :title="action.label"
          @click="action.run()"
        >
          <component :is="action.icon" class="size-4" />
        </Button>
      </template>

      <div class="mx-1 h-5 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="size-8"
        :class="editor.isActive('link') ? 'bg-muted text-foreground' : 'text-muted-foreground'"
        aria-label="Link"
        title="Link"
        @click="openLinkDialog"
      >
        <LinkIcon class="size-4" />
      </Button>

      <div class="mx-1 h-5 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="size-8 text-muted-foreground"
        aria-label="Desfazer"
        title="Desfazer"
        :disabled="!editor.can().undo()"
        @click="editor.chain().focus().undo().run()"
      >
        <Undo2Icon class="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="size-8 text-muted-foreground"
        aria-label="Refazer"
        title="Refazer"
        :disabled="!editor.can().redo()"
        @click="editor.chain().focus().redo().run()"
      >
        <Redo2Icon class="size-4" />
      </Button>
    </div>

    <EditorContent :editor="editor" />
  </div>

  <Dialog v-model:open="linkDialogOpen">
    <DialogContent class="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>Link</DialogTitle>
      </DialogHeader>
      <Input v-model="linkUrl" type="url" placeholder="https://..." @keydown.enter.prevent="applyLink" />
      <DialogFooter class="gap-2 sm:justify-between">
        <Button v-if="editor?.isActive('link')" type="button" variant="outline" @click="removeLink">
          Remover link
        </Button>
        <Button type="button" class="ml-auto" @click="applyLink">
          Aplicar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
