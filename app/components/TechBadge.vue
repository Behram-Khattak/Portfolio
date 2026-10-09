<script setup lang="ts">
// A coloured pill for a technology name. Names are free text from the dashboard, so the hue is
// derived from the name itself: the same tech gets the same colour everywhere.
const props = defineProps<{ name: string }>();

const HUES = [350, 18, 42, 150, 176, 204, 250, 292];
const hue = computed(() => {
  let hash = 0;
  for (const char of props.name.toLowerCase()) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return HUES[hash % HUES.length];
});
</script>

<template>
  <span class="tech-badge" :style="{ '--h': hue }">{{ name }}</span>
</template>
