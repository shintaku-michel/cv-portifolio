<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Send } from '@lucide/vue'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Pagar um café',
  description: 'Descreva o problema ou dúvida que você quer discutir — vamos marcar um café para conversar sobre o diagnóstico e possíveis formas de resolver.',
  ogTitle: 'Pagar um café',
  ogUrl: `${requestUrl.origin}/pagar-um-cafe`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/pagar-um-cafe` }] })

const EVALUATION_TYPES = {
  'diagnostico-rapido': 'Apenas diagnóstico rápido (resposta por e-mail)',
  'cafe-virtual': 'Diagnóstico e café virtual (100% grátis)'
} as const

type EvaluationType = keyof typeof EVALUATION_TYPES

const name = ref('')
const email = ref('')
const evaluationType = ref<EvaluationType>()
const description = ref('')

const isValid = computed(() =>
  name.value.trim() !== '' && email.value.trim() !== '' && !!evaluationType.value && description.value.trim() !== '')

const submitting = ref(false)
const submitted = ref(false)
const errorMessage = ref<string | null>(null)

async function onSubmit() {
  if (!isValid.value || submitting.value) return

  submitting.value = true
  errorMessage.value = null
  try {
    await $fetch('/api/pagar-um-cafe', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        evaluationType: evaluationType.value,
        description: description.value
      }
    })
    submitted.value = true
  } catch (error) {
    errorMessage.value = (error as { data?: { message?: string } })?.data?.message
      ?? 'Não foi possível enviar sua mensagem. Tente novamente em instantes.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-12 md:mx-auto md:w-3xl md:py-17">
    <div class="mb-2">
      <h1 class="text-2xl font-semibold">
        Pagar um café
      </h1>
      <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground mt-1">
        Uma consultoria custa muito menos do que começar um projeto sem clareza sobre o que realmente precisa ser
        feito
      </p>
    </div>

    <div class="flex flex-col gap-3 mb-6">
      <p>
        Descreva o problema ou a dúvida que você tem sobre o seu produto digital. Depois de analisar sua mensagem,
        marcamos um café (virtual) para conversar sobre o cenário, entender melhor o problema e explorar possíveis
        soluções.
      </p>
      <p>
        Esse bate-papo inicial é 100% gratuito e sem compromisso. Se, depois dessa conversa, fizer sentido avançar,
        podemos elaborar um diagnóstico completo e estruturado, com recomendações práticas e direcionadas à
        implementação das melhores soluções para o seu projeto.
      </p>
    </div>

    <div v-if="submitted" role="status" class="flex flex-col gap-2 rounded-sm border border-primary/30 bg-primary/5 p-5">
      <p class="font-medium">
        Mensagem enviada!
      </p>
      <p class="text-sm text-muted-foreground">
        Obrigado pelo contato, {{ name }}. Vou ler com atenção e retorno em breve pelo e-mail informado.
      </p>
    </div>

    <form v-else class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <div class="flex gap-4">
        <div class="flex flex-col gap-2 flex-1">
          <Label for="name">Nome</Label>
          <Input id="name" v-model="name" type="text" autocomplete="name" required :disabled="submitting" />
        </div>
        <div class="flex flex-col gap-2 flex-1">
          <Label for="email">Email</Label>
          <Input id="email" v-model="email" type="email" autocomplete="email" required :disabled="submitting" />
        </div>
      </div>

      <fieldset class="flex flex-col border border-muted p-4 rounded-sm">
        <legend class="text-sm font-medium">
          Tipo de avaliação do problema
        </legend>
        <RadioGroup v-model="evaluationType" required :disabled="submitting" class="flex flex-col gap-4">
          <div v-for="(label, value) in EVALUATION_TYPES" :key="value" class="flex items-center gap-2">
            <RadioGroupItem :id="`evaluation-${value}`" :value="value" />
            <Label :for="`evaluation-${value}`" class="font-normal">{{ label }}</Label>
          </div>
        </RadioGroup>
      </fieldset>

      <div class="flex flex-col gap-2">
        <Label for="description">O que você precisa?</Label>
        <Textarea id="description" v-model="description" rows="6" required :disabled="submitting"
          placeholder="Descreva o contexto, o problema e o que você já tentou fazer." />
      </div>

      <p v-if="errorMessage" role="alert" class="text-sm text-destructive">
        {{ errorMessage }}
      </p>

      <Button type="submit" :disabled="!isValid || submitting" class="self-start">
        <Send />
        {{ submitting ? 'Enviando…' : 'Enviar mensagem' }}
      </Button>
    </form>
  </div>
</template>
