<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin · Meu perfil' })

const { user } = useAuth()

const bio = ref(user.value?.bio ?? '')
const avatarUrl = ref(user.value?.avatarUrl ?? '')

const submitting = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref(false)

const authorInitials = computed(() =>
  (user.value?.name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]!.toUpperCase())
    .join('')
)

const MUTATION = `
  mutation ($input: UpdateProfileInput!) {
    updateProfile(input: $input) { id name email role bio avatarUrl }
  }
`

async function onSubmit() {
  submitting.value = true
  errorMessage.value = null
  successMessage.value = false
  try {
    const result = await useGraphQL<{ updateProfile: NonNullable<typeof user.value> }>(MUTATION, {
      input: { bio: bio.value, avatarUrl: avatarUrl.value }
    })
    user.value = result.updateProfile
    successMessage.value = true
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Não foi possível salvar o perfil'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-lg px-4 py-12">
    <h1 class="mb-6 text-2xl font-semibold">
      Meu perfil
    </h1>
    <p class="mb-6 text-sm text-muted-foreground">
      Essas informações aparecem na identificação do autor nos posts do blog.
    </p>

    <div class="mb-6 flex items-center gap-3">
      <Avatar size="lg">
        <AvatarImage v-if="avatarUrl" :src="avatarUrl" :alt="user?.name" />
        <AvatarFallback>{{ authorInitials }}</AvatarFallback>
      </Avatar>
      <p class="text-sm text-muted-foreground">
        Pré-visualização do avatar
      </p>
    </div>

    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <div class="flex flex-col gap-2">
        <Label for="avatarUrl">Foto (URL)</Label>
        <Input id="avatarUrl" v-model="avatarUrl" type="url" placeholder="https://..." />
      </div>

      <div class="flex flex-col gap-2">
        <Label for="bio">Bio</Label>
        <Textarea id="bio" v-model="bio" rows="3" maxlength="280" placeholder="Uma frase curta sobre você" />
      </div>

      <p v-if="errorMessage" role="alert" class="text-sm text-destructive">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" role="status" class="text-sm text-muted-foreground">
        Perfil atualizado.
      </p>

      <Button type="submit" class="self-start" :disabled="submitting">
        {{ submitting ? 'Salvando…' : 'Salvar' }}
      </Button>
    </form>
  </div>
</template>
