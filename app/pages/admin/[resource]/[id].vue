<script setup lang="ts">
definePageMeta({ layout: "admin" });

const route = useRoute();
const name = String(route.params.resource);
const config = adminResources[name];
if (!config) throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });

const isNew = route.params.id === "new";
useHead({ title: `${isNew ? "New" : "Edit"} ${config.singular}` });

const form = ref<Record<string, any>>(structuredClone(config.defaults));
if (!isNew) {
  try {
    const row = await adminFetch<Record<string, any>>(`/api/admin/${name}/${route.params.id}`);
    // Only the editable fields; ids and timestamps stay on the server
    form.value = Object.fromEntries(Object.keys(config.defaults).map((key) => [key, row[key] ?? config.defaults[key]]));
  } catch {
    throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
  }
}

const errors = ref<Record<string, string>>({});
const failure = ref("");
const saving = ref(false);

async function save() {
  failure.value = "";
  const parsed = config!.schema.safeParse(form.value);
  if (!parsed.success) {
    errors.value = fieldErrors(parsed.error);
    failure.value = "Some fields need attention.";
    return;
  }
  errors.value = {};
  saving.value = true;
  try {
    await adminFetch(isNew ? `/api/admin/${name}` : `/api/admin/${name}/${route.params.id}`, { method: isNew ? "POST" : "PUT", body: parsed.data });
    await navigateTo(`/admin/${name}`);
  } catch (error) {
    failure.value = errorMessage(error);
    if ((error as { statusCode?: number }).statusCode === 409) errors.value = { slug: failure.value };
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form class="max-w-4xl" novalidate @submit.prevent="save">
    <h1 class="admin-title">{{ isNew ? `New ${config.singular}` : form[config.labelKey] || `Edit ${config.singular}` }}</h1>

    <div class="mt-8">
      <AdminForm v-model="form" :fields="config.fields" :errors="errors" :auto-slug="isNew" />
    </div>

    <div class="sticky bottom-0 mt-8 flex items-center gap-4 border-t border-line bg-base py-4">
      <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? "Saving…" : isNew ? `Create ${config.singular}` : "Save changes" }}</button>
      <NuxtLink :to="`/admin/${name}`" class="btn btn-ghost">Cancel</NuxtLink>
      <p v-if="failure" class="text-danger" role="alert">{{ failure }}</p>
    </div>
  </form>
</template>
