<script setup lang="ts">
const model = defineModel<string>({ required: true });
defineProps<{ id: string }>();

const previewing = ref(false);
// Same renderer as the public site, so the preview is exact
const html = computed(() => (previewing.value ? renderMarkdown(model.value) : ""));
</script>

<template>
  <div>
    <div class="mb-2 flex gap-1" role="tablist">
      <button type="button" role="tab" :aria-selected="!previewing" :class="['btn btn-sm', previewing ? 'text-muted' : 'btn-ghost']" @click="previewing = false">Write</button>
      <button type="button" role="tab" :aria-selected="previewing" :class="['btn btn-sm', previewing ? 'btn-ghost' : 'text-muted']" @click="previewing = true">Preview</button>
    </div>
    <textarea v-show="!previewing" :id="id" v-model="model" rows="16" class="field font-mono text-sm" spellcheck="true" />
    <div v-if="previewing" class="min-h-40 rounded-lg border border-line bg-surface p-5">
      <p v-if="!html" class="text-muted">Nothing to preview yet.</p>
      <div v-else class="prose" v-html="html" />
    </div>
    <p class="mt-1 text-sm text-muted">Markdown: ## heading, **bold**, [link](https://…), `code`, lists. Raw HTML is not rendered.</p>
  </div>
</template>
