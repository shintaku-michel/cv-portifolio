<script setup lang="ts">
import TechBadge from '@/components/common/TechBadge.vue';
import { TECH_ICONS } from '@/utils/tech-icons';

// Triplica a lista para o loop de CSS (translateX -33.333%) ficar contínuo
// sem "salto" visível entre o fim e o início.
const marqueeItems = [...TECH_ICONS, ...TECH_ICONS, ...TECH_ICONS]
</script>

<template>
  <div
    class="mask-[linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)] w-full overflow-hidden">
    <div class="tech-marquee-track flex w-max gap-3 py-1">
      <TechBadge v-for="(tech, index) in marqueeItems" :key="`${tech.slug}-${index}`" :name="tech.title"
        :slug="tech.slug" class="shrink-0" />
    </div>
  </div>
</template>

<style scoped>
.tech-marquee-track {
  animation: tech-marquee 180s linear infinite;
}

@keyframes tech-marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-33.3333%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tech-marquee-track {
    animation: none;
  }
}
</style>
