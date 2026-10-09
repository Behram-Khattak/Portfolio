<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });

const route = useRoute();
const name = String(route.params.resource);
const config = adminResources[name];
if (!config) throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
useHead({ title: config.title });

const { data: items, refresh } = await useAsyncData(`admin-${name}`, () => adminFetch<Record<string, any>[]>(`/api/admin/${name}`));
const failure = ref("");
const hasStatus = "published" in config.defaults;

async function remove(item: Record<string, any>) {
  if (!confirm(`Delete "${item[config!.labelKey]}"? This cannot be undone.`)) return;
  failure.value = "";
  try {
    await adminFetch(`/api/admin/${name}/${item.id}`, { method: "DELETE" });
    await refresh();
  } catch (error) {
    failure.value = errorMessage(error);
  }
}

const display = (item: Record<string, any>, key: string) => (key === "publishedAt" ? formatDate(item[key]) || "Not published" : item[key]);
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-3xl font-semibold">{{ config.title }}</h1>
      <NuxtLink :to="`/admin/${name}/new`" class="btn btn-primary"><Icon name="lucide:plus" size="16" /> New {{ config.singular }}</NuxtLink>
    </div>
    <p v-if="failure" class="mt-4 text-danger" role="alert">{{ failure }}</p>

    <p v-if="!items?.length" class="mt-10 text-muted">
      Nothing here yet. <NuxtLink :to="`/admin/${name}/new`" class="link">Add your first {{ config.singular }}</NuxtLink>
    </p>
    <div v-else class="mt-6 overflow-x-auto rounded-xl border border-line">
      <table class="w-full text-left text-[0.95rem]">
        <thead class="border-b border-line bg-surface text-sm text-muted">
          <tr>
            <th v-for="column in config.columns" :key="column.key" scope="col" class="px-4 py-3 font-medium">{{ column.label }}</th>
            <th v-if="hasStatus" scope="col" class="px-4 py-3 font-medium">Status</th>
            <th scope="col" class="px-4 py-3"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line">
          <tr v-for="item in items" :key="item.id">
            <td v-for="(column, index) in config.columns" :key="column.key" class="max-w-xs truncate px-4 py-3">
              <NuxtLink v-if="index === 0" :to="`/admin/${name}/${item.id}`" class="font-medium hover:text-accent">{{ display(item, column.key) }}</NuxtLink>
              <span v-else class="text-muted">{{ display(item, column.key) }}</span>
            </td>
            <td v-if="hasStatus" class="px-4 py-3">
              <span :class="item.published ? 'text-ok' : 'text-muted'">{{ item.published ? "Published" : "Draft" }}</span>
              <span v-if="item.featured" class="text-muted">, featured</span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-right">
              <a v-if="config.publicPath && item.published" :href="config.publicPath(item)" target="_blank" class="btn btn-ghost btn-sm mr-2">View</a>
              <NuxtLink :to="`/admin/${name}/${item.id}`" class="btn btn-ghost btn-sm mr-2">Edit</NuxtLink>
              <button type="button" class="btn btn-danger btn-sm" @click="remove(item)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
