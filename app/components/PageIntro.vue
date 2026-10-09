<script setup lang="ts">
defineProps<{ title: string; lead?: string }>();
</script>

<template>
  <div class="shell pt-14 md:pt-24">
    <h1 class="max-w-[16ch] text-6xl font-normal md:text-8xl">{{ title }}</h1>
    <p v-if="lead" class="mt-8 max-w-[52ch] border-t border-line pt-6 text-lg text-muted md:text-xl">{{ lead }}</p>
    <slot />
  </div>
</template>
