<script setup lang="ts">
import { settingsSchemas, type SettingsKey } from "#shared/utils/schemas";

const props = defineProps<{ settingsKey: SettingsKey; initial: Record<string, any> }>();
const config = settingsForms[props.settingsKey];

const form = ref(structuredClone(toRaw(props.initial)));
const errors = ref<Record<string, string>>({});
const state = ref<"idle" | "saving" | "saved">("idle");
const failure = ref("");

async function save() {
  failure.value = "";
  const parsed = settingsSchemas[props.settingsKey].safeParse(form.value);
  if (!parsed.success) return (errors.value = fieldErrors(parsed.error));
  errors.value = {};
  state.value = "saving";
  try {
    await adminFetch(`/api/admin/settings/${props.settingsKey}`, { method: "PUT", body: parsed.data });
    state.value = "saved";
  } catch (error) {
    state.value = "idle";
    failure.value = errorMessage(error);
  }
}
</script>

<template>
  <form class="rounded-xl border border-line bg-surface/50 p-6" novalidate @submit.prevent="save" @input="state = 'idle'">
    <h2 class="text-xl font-semibold">{{ config.title }}</h2>
    <div class="mt-5">
      <AdminForm v-model="form" :fields="config.fields" :errors="errors" />
    </div>
    <div class="mt-6 flex items-center gap-4">
      <button type="submit" class="btn btn-primary" :disabled="state === 'saving'">{{ state === "saving" ? "Saving…" : "Save changes" }}</button>
      <p v-if="state === 'saved'" class="text-ok" role="status">Saved</p>
      <p v-if="failure" class="text-danger" role="alert">{{ failure }}</p>
    </div>
  </form>
</template>
