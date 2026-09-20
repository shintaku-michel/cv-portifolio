<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HeartIcon } from '@lucide/vue'

const member = {
  name: 'Ana Carolina',
  role: 'Product Designer',
  image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80',
  bio: 'Focada em transformar problemas complexos em interfaces simples, acessíveis e bonitas de usar.',
  tags: ['UX', 'UI', 'Design System']
}
</script>

<template>
  <Card class="w-full flex-col gap-2 rounded-lg p-0 min-[700px]:flex-row">
    <img :src="member.image" :alt="member.name"
      class="h-65 w-full object-cover min-[700px]:h-auto min-[700px]:w-1/2 min-[700px]:min-w-[50%] min-[700px]:self-stretch min-[700px]:rounded-tr-none!">

    <CardContent class="flex flex-col gap-4 px-6 py-6 min-[480px]:flex-1 min-[480px]:justify-center min-[700px]:pr-6">
      <div>
        <h2 class="text-2xl font-normal">
          {{ member.name }}
        </h2>
        <h3 class="text-lg font-normal text-muted-foreground">
          {{ member.role }}
        </h3>
      </div>

      <p class="truncate text-muted-foreground min-[560px]:text-wrap min-[560px]:whitespace-normal">
        {{ member.bio }}
      </p>

      <div
        class="flex flex-col gap-4 pb-4 min-[560px]:flex-row min-[560px]:items-center min-[700px]:flex-col min-[700px]:items-start">
        <div class="flex gap-2.5">
          <Badge v-for="tag in member.tags" :key="tag" variant="secondary"
            class="h-auto rounded-2xl bg-foreground/8 px-3 py-1 text-sm font-normal italic text-foreground backdrop-blur-lg">
            {{ tag }}
          </Badge>
        </div>

        <div class="flex gap-2 min-[560px]:ml-auto min-[700px]:mt-4 min-[700px]:ml-0">
          <Button class="h-12 w-full flex-1 rounded-full px-6 min-[560px]:w-fit min-[560px]:flex-none cursor-pointer"
            variant="default">
            Contrate agora
          </Button>
          <Button size="icon" variant="secondary"
            class="size-12 shrink-0 rounded-full bg-foreground/10 hover:bg-foreground/18 cursor-pointer">
            <HeartIcon />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
