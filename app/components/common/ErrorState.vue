<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), {
  message: 'Não foi possível carregar os dados. Tente novamente.'
})
</script>

<template>
  <p role="alert" class="text-sm text-destructive">
    {{ message }}
  </p>
</template>
