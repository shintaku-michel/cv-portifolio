<script setup lang="ts">
// Mostra o código-fonte de um componente de playground com botão de copiar
// e a lista de primitivos @/components/ui/* dos quais ele depende — quem for
// reusar o código em outro projeto precisa copiar esses arquivos também,
// eles não vêm junto no "copiar código" (mesma ideia da página de docs do
// shadcn: código + lista de dependências, não um zip com tudo dentro).
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getPlaygroundDependencies, PLAYGROUND_SOURCES, usesLucideIcons } from '@/utils/playground-components';
import { CheckIcon, CopyIcon } from '@lucide/vue';

const props = defineProps<{
  componentKey: string
}>()

const source = computed(() => PLAYGROUND_SOURCES[props.componentKey])
const dependencies = computed(() => getPlaygroundDependencies(props.componentKey))
const hasIcons = computed(() => usesLucideIcons(props.componentKey))

const copied = ref(false)

async function copyCode() {
  if (!source.value) return
  await navigator.clipboard.writeText(source.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div v-if="source" class="mb-8 flex flex-col gap-3 mt-8">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-md font-semibold">
        Código do componente
      </h2>
    </div>

    <div class="flex flex-col gap-4">
      <p class="text-sm text-muted-foreground">
        Dependências com
        <Badge variant="secondary" class="mx-0.5">
          Tailwind CSS
        </Badge>
        <template v-if="hasIcons">
          <Badge variant="secondary" class="mx-0.5">
            Lucide icons
          </Badge>
        </template>
        <template v-if="dependencies.length">
          e de
          <Badge v-for="dep in dependencies" :key="dep" variant="outline" class="mx-0.5">
            {{ dep }}
          </Badge>
          do
          <Badge variant="secondary" class="mx-0.5">
            Shadcn
          </Badge>
          — instale-as antes de colar este código.
        </template>
      </p>
    </div>

    <pre class="max-h-120 overflow-auto rounded-lg border bg-muted/30 p-4 text-xs"><code>{{ source }}</code></pre>

    <div class="flex justify-end">
      <Button variant="outline" size="sm" @click="copyCode">
        <CheckIcon v-if="copied" class="size-4" />
        <CopyIcon v-else class="size-4" />
        {{ copied ? 'Copiado!' : 'Copiar código' }}
      </Button>
    </div>
  </div>
</template>
