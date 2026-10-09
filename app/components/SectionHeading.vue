<script setup lang="ts">
// Display heading in two tones: the title in ink, a short companion line in smoke grey.
defineProps<{ title: string; sub?: string }>();
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-6">
    <h2 class="text-5xl font-normal md:text-7xl">
      {{ title }}
      <span v-if="sub" class="block text-accent-2">{{ sub }}</span>
    </h2>
    <slot />
  </div>
</template>
