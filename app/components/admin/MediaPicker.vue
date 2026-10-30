<script setup lang="ts">
// Picks one image (v-model: number | null) or several (multiple, v-model: number[])
const props = defineProps<{ multiple?: boolean }>();
const model = defineModel<number | number[] | null>({ required: true });

const { data: library, refresh } = await useAsyncData("admin-media", () => adminFetch("/api/admin/media"));
const dialog = ref<HTMLDialogElement>();
const uploading = ref(false);
const failure = ref("");

const selectedIds = computed(() => (Array.isArray(model.value) ? model.value : model.value ? [model.value] : []));
const selected = computed(() => selectedIds.value.map((id) => library.value?.find((item) => item.id === id)).filter((item) => item !== undefined));

function toggle(id: number) {
  if (props.multiple) {
    const ids = selectedIds.value;
    model.value = ids.includes(id) ? ids.filter((other) => other !== id) : [...ids, id];
  } else {
    model.value = id;
    dialog.value?.close();
  }
}

function remove(id: number) {
  model.value = props.multiple ? selectedIds.value.filter((other) => other !== id) : null;
}

async function upload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  failure.value = "";
  uploading.value = true;
  try {
    const { id } = await adminFetch<{ id: number }>("/api/admin/media", { method: "POST", body: await prepareImage(file) });
    await refresh();
    toggle(id);
  } catch (error) {
    failure.value = errorMessage(error, "The image could not be uploaded.");
  } finally {
    uploading.value = false;
    input.value = "";
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-start gap-3">
      <div v-for="item in selected" :key="item.id" class="relative">
        <img :src="item.thumb" :alt="item.alt" class="size-24 rounded-lg border border-line bg-raised object-contain" />
        <button type="button" class="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full border border-line bg-surface text-muted hover:text-danger" :aria-label="`Remove ${item.originalName}`" @click="remove(item.id)">
          <Icon name="lucide:x" size="14" />
        </button>
      </div>
      <button type="button" class="btn btn-ghost btn-sm" @click="dialog?.showModal()">
        <Icon name="lucide:image" size="16" /> {{ multiple ? "Add images" : selected.length ? "Change image" : "Choose image" }}
      </button>
    </div>

    <dialog ref="dialog" class="m-auto w-[min(56rem,92vw)] rounded-xl border border-line bg-base p-0 text-fg backdrop:bg-black/60">
      <div class="flex items-center justify-between gap-4 border-b border-line p-4">
        <h2 class="text-xl font-semibold">Choose {{ multiple ? "images" : "an image" }}</h2>
        <div class="flex items-center gap-2">
          <label class="btn btn-primary btn-sm">
            <Icon name="lucide:upload" size="16" /> {{ uploading ? "Uploading…" : "Upload new" }}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="sr-only" :disabled="uploading" @change="upload" />
          </label>
          <button type="button" class="btn btn-ghost btn-sm" @click="dialog?.close()">Done</button>
        </div>
      </div>
      <p v-if="failure" class="px-4 pt-3 text-danger" role="alert">{{ failure }}</p>
      <p v-if="!library?.length" class="p-8 text-muted">No images yet. Upload one to get started.</p>
      <div v-else class="grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto p-4 sm:grid-cols-5">
        <button
          v-for="item in library"
          :key="item.id"
          type="button"
          :class="['overflow-hidden rounded-lg border-2 bg-raised', selectedIds.includes(item.id) ? 'border-accent' : 'border-transparent hover:border-line']"
          :aria-pressed="selectedIds.includes(item.id)"
          :title="item.originalName"
          @click="toggle(item.id)"
        >
          <img :src="item.thumb" :alt="item.alt || item.originalName" class="aspect-square w-full object-contain" loading="lazy" />
        </button>
      </div>
    </dialog>
  </div>
</template>
