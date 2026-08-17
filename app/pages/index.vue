<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4">
    <h1 class="text-2xl font-semibold">Portfolio CMS</h1>
    <p class="text-muted-foreground">Authentication (M3) em andamento.</p>
    <NuxtLink to="/login">
      <Button>Login</Button>
    </NuxtLink>
  </div>
</template>
