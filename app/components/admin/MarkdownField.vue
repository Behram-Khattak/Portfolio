<script setup lang="ts">
const model = defineModel<string>({ required: true });
defineProps<{ id: string }>();

const previewing = ref(false);
const html = ref("");
const loading = ref(false);

async function showPreview() {
  previewing.value = true;
  loading.value = true;
  try {
    // Same server-side renderer as the public site, so the preview is exact
    ({ html: html.value } = await adminFetch<{ html: string }>("/api/admin/preview", { method: "POST", body: { markdown: model.value } }));
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <div class="mb-2 flex gap-1" role="tablist">
      <button type="button" role="tab" :aria-selected="!previewing" :class="['btn btn-sm', previewing ? 'text-muted' : 'btn-ghost']" @click="previewing = false">Write</button>
      <button type="button" role="tab" :aria-selected="previewing" :class="['btn btn-sm', previewing ? 'btn-ghost' : 'text-muted']" @click="showPreview">Preview</button>
    </div>
    <textarea v-show="!previewing" :id="id" v-model="model" rows="16" class="field font-mono text-sm" spellcheck="true" />
    <div v-if="previewing" class="min-h-40 rounded-lg border border-line bg-surface p-5">
      <p v-if="loading" class="text-muted">Rendering…</p>
      <p v-else-if="!html" class="text-muted">Nothing to preview yet.</p>
      <!-- eslint-disable-next-line vue/no-v-html -- rendered server-side with raw HTML disabled -->
      <div v-else class="prose" v-html="html" />
    </div>
    <p class="mt-1 text-sm text-muted">Markdown: ## heading, **bold**, [link](https://…), `code`, lists. Raw HTML is not rendered.</p>
  </div>
</template>
