<script setup lang="ts">
const model = defineModel<string>({ required: true });
defineProps<{ id: string }>();

const mode = ref<"visual" | "markdown">("visual");
</script>

<template>
  <div>
    <div class="mb-2 flex gap-1" role="tablist">
      <button type="button" role="tab" :aria-selected="mode === 'visual'" :class="['btn btn-sm', mode === 'visual' ? 'btn-ghost' : 'text-muted']" @click="mode = 'visual'">Visual</button>
      <button type="button" role="tab" :aria-selected="mode === 'markdown'" :class="['btn btn-sm', mode === 'markdown' ? 'btn-ghost' : 'text-muted']" @click="mode = 'markdown'">Markdown</button>
    </div>
    <!-- The editor rebuilds from the model each time, so edits in either tab carry over -->
    <LazyAdminRichTextEditor v-if="mode === 'visual'" :id="id" v-model="model" />
    <template v-else>
      <textarea :id="id" v-model="model" rows="16" class="field font-mono text-sm" spellcheck="true" />
      <p class="mt-1 text-sm text-muted">Markdown: ## heading, **bold**, [link](https://…), `code`, ``` code block. Raw HTML is not rendered.</p>
    </template>
  </div>
</template>
