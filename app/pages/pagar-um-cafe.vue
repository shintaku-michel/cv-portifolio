<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const name = ref('')
const email = ref('')
const description = ref('')

const mailtoHref = computed(() => {
  const subject = `Pagar um café — ${name.value || 'Novo contato'}`
  const body = `Nome: ${name.value}\nEmail: ${email.value}\n\nDescrição:\n${description.value}`
  return `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
})

const isValid = computed(() => name.value.trim() !== '' && email.value.trim() !== '' && description.value.trim() !== '')

function sendEmail() {
  window.location.href = mailtoHref.value
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-16">
    <div class="mb-8 flex flex-col gap-3">
      <h1 class="text-2xl font-semibold">
        Pagar um café
      </h1>
      <p class="text-muted-foreground">
        Descreva o problema ou a dúvida que você tem. Depois de ler, marcamos um café (virtual) para conversar
        sobre o diagnóstico e possíveis formas de resolver.
      </p>
    </div>

    <form class="flex flex-col gap-4" @submit.prevent>
      <div class="flex flex-col gap-2">
        <Label for="name">Nome</Label>
        <Input id="name" v-model="name" type="text" autocomplete="name" required />
      </div>

      <div class="flex flex-col gap-2">
        <Label for="email">Email</Label>
        <Input id="email" v-model="email" type="email" autocomplete="email" required />
      </div>

      <div class="flex flex-col gap-2">
        <Label for="description">O que você precisa?</Label>
        <Textarea id="description" v-model="description" rows="6" required
          placeholder="Descreva o contexto, o problema e o que já tentou." />
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
