<script setup lang="ts">
definePageMeta({ layout: "admin" });
useHead({ title: "Images" });

const { data: items, refresh } = await useAsyncData("admin-media", () => adminFetch("/api/admin/media"));
const failure = ref("");
const uploading = ref(false);

async function upload(event: Event) {
  const input = event.target as HTMLInputElement;
  failure.value = "";
  uploading.value = true;
  try {
    for (const file of Array.from(input.files ?? [])) {
      await adminFetch("/api/admin/media", { method: "POST", body: await prepareImage(file) });
    }
  } catch (error) {
    failure.value = errorMessage(error, "The image could not be uploaded.");
  } finally {
    uploading.value = false;
    input.value = "";
    await refresh();
  }
}

async function saveAlt(id: number, alt: string) {
  failure.value = "";
  try {
    await adminFetch(`/api/admin/media/${id}`, { method: "PUT", body: { alt } });
  } catch (error) {
    failure.value = errorMessage(error);
  }
}

async function remove(item: { id: number; originalName: string }) {
  if (!confirm(`Delete "${item.originalName}"? This cannot be undone.`)) return;
  failure.value = "";
  try {
    await adminFetch(`/api/admin/media/${item.id}`, { method: "DELETE" });
    await refresh();
  } catch (error) {
    failure.value = errorMessage(error);
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="admin-title">Images</h1>
      <label class="btn btn-primary">
        <Icon name="lucide:upload" size="16" /> {{ uploading ? "Uploading…" : "Upload images" }}
        <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" class="sr-only" :disabled="uploading" @change="upload" />
      </label>
    </div>
    <p class="mt-2 text-muted">JPEG, PNG, WebP or AVIF. Images are resized and converted before upload, and location data is removed.</p>
    <p v-if="failure" class="mt-4 text-danger" role="alert">{{ failure }}</p>

    <p v-if="!items?.length" class="mt-10 text-muted">No images yet. Upload screenshots, logos and photos to use across the site.</p>
    <ul v-else class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <li v-for="item in items" :key="item.id" class="admin-card p-3">
        <a :href="item.url" target="_blank"><img :src="item.thumb" :alt="item.alt" class="aspect-video w-full rounded-lg bg-raised object-contain" loading="lazy" /></a>
        <p class="mt-3 truncate text-sm" :title="item.originalName">{{ item.originalName }}</p>
        <p class="text-sm text-muted">{{ item.width }} × {{ item.height }}, {{ Math.round(item.size / 1024) }} KB</p>
        <label class="mt-3 block text-sm text-muted" :for="`alt-${item.id}`">Description for screen readers</label>
        <input :id="`alt-${item.id}`" v-model="item.alt" class="field mt-1 text-sm" @change="saveAlt(item.id, item.alt)" />
        <button type="button" class="btn btn-danger btn-sm mt-3" @click="remove(item)">Delete</button>
      </li>
    </ul>
  </div>
</template>
