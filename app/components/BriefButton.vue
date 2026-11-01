<script setup lang="ts">
// A real link to /contact, so it still works if JavaScript hasn't loaded
const props = defineProps<{ kind?: "project" | "consultation"; service?: string }>();
const { open } = useBrief();
</script>

<template>
  <a href="/contact" @click.prevent="open(props.kind ?? 'project', props.service)"><slot /></a>
</template>
