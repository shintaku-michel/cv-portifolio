<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Pagar um café',
  description: 'Descreva o problema ou dúvida que você quer discutir — vamos marcar um café para conversar sobre o diagnóstico e possíveis formas de resolver.',
  ogTitle: 'Pagar um café',
  ogUrl: `${requestUrl.origin}/pagar-um-cafe`
})
useHead({ link: [{ rel: 'canonical', href: `${requestUrl.origin}/pagar-um-cafe` }] })

// Sem backend próprio ainda — o formulário monta um e-mail (mailto:) com os
// dados preenchidos em vez de fingir que os dados foram salvos em algum lugar.
const OWNER_EMAIL = 'michel.shintaku@gmail.com'

const EVALUATION_TYPES = {
  'diagnostico-rapido': 'Apenas diagnóstico rápido (resposta por e-mail)',
  'cafe-virtual': 'Diagnóstico e café virtual (100% grátis)'
} as const

type EvaluationType = keyof typeof EVALUATION_TYPES

const name = ref('')
const email = ref('')
const evaluationType = ref<EvaluationType>()
const description = ref('')

const mailtoHref = computed(() => {
  const subject = `Pagar um café — ${name.value || 'Novo contato'}`
  const evaluationLabel = evaluationType.value ? EVALUATION_TYPES[evaluationType.value] : ''
  const body = `Nome: ${name.value}\nEmail: ${email.value}\nTipo de avaliação: ${evaluationLabel}\n\nDescrição:\n${description.value}`
  return `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
})

const isValid = computed(() =>
  name.value.trim() !== '' && email.value.trim() !== '' && !!evaluationType.value && description.value.trim() !== '')

function sendEmail() {
  window.location.href = mailtoHref.value
}
</script>

<template>
  <div class="px-6 py-12 md:mx-auto md:w-3xl md:py-17">
    <div class="mb-8 flex flex-col gap-3">
      <h1 class="text-2xl font-semibold">
        Pagar um café
      </h1>
      <p class="font-cursive text-[1.4rem] leading-5 text-muted-foreground">
        Uma consultoria custa muito menos do que começar um projeto sem clareza sobre o que realmente precisa ser
        feito
      </p>
      <p class="text-muted-foreground">
        Descreva o problema ou a dúvida que você tem sobre o seu produto digital. Depois de analisar sua mensagem,
        marcamos um café (virtual) para conversar sobre o cenário, entender melhor o problema e explorar possíveis
        soluções.
      </p>
      <p class="text-muted-foreground">
        Esse bate-papo inicial é 100% gratuito e sem compromisso. Se fizer sentido para você avançar, podemos elaborar
        um diagnóstico completo, estruturado e direcionado à implementação.
      </p>
    </div>

    <form class="flex flex-col gap-4" @submit.prevent>

      <div class="flex gap-4">
        <div class="flex flex-col gap-2 flex-1">
          <Label for="name">Nome</Label>
          <Input id="name" v-model="name" type="text" autocomplete="name" required />
        </div>
        <div class="flex flex-col gap-2 flex-1">
          <Label for="email">Email</Label>
          <Input id="email" v-model="email" type="email" autocomplete="email" required />
        </div>
      </div>

      <fieldset class="flex flex-col border border-muted p-4 rounded-sm">
        <legend class="text-sm font-medium">
          Tipo de avaliação do problema
        </legend>
        <RadioGroup v-model="evaluationType" required class="flex flex-col gap-4">
          <div v-for="(label, value) in EVALUATION_TYPES" :key="value" class="flex items-center gap-2">
            <RadioGroupItem :id="`evaluation-${value}`" :value="value" />
            <Label :for="`evaluation-${value}`" class="font-normal">{{ label }}</Label>
          </div>
        </RadioGroup>
      </fieldset>

      <div class="flex flex-col gap-2">
        <Label for="description">O que você precisa?</Label>
        <Textarea id="description" v-model="description" rows="6" required
          placeholder="Descreva o contexto, o problema e o que você já tentou fazer." />
      </div>

      <Button type="button" :disabled="!isValid" class="self-start" @click="sendEmail">
        Enviar por e-mail
      </Button>
      <p class="text-xs text-muted-foreground">
        Isso abre seu cliente de e-mail padrão com a mensagem já preenchida.
      </p>
    </form>
  </div>
</template>
