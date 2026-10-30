<script setup lang="ts">
definePageMeta({ layout: "admin" });
useHead({ title: "Settings" });

const { data: settings, refresh: refreshSettings } = await useAsyncData("admin-settings", () => adminFetch("/api/admin/settings"));

// Résumé
const resumeMessage = ref("");
const resumeBusy = ref(false);
async function uploadResume(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  resumeMessage.value = "";
  resumeBusy.value = true;
  try {
    const body = new FormData();
    body.append("file", file);
    await adminFetch("/api/admin/settings/resume", { method: "POST", body });
    await refreshSettings();
  } catch (error) {
    resumeMessage.value = errorMessage(error, "The file could not be uploaded.");
  } finally {
    resumeBusy.value = false;
    input.value = "";
  }
}
async function removeResume() {
  if (!confirm("Remove your résumé from the site?")) return;
  await adminFetch("/api/admin/settings/resume", { method: "DELETE" });
  await refreshSettings();
}
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-semibold">Settings</h1>

    <div v-if="settings" class="mt-8 space-y-8">
      <AdminSettingsForm settings-key="site" :initial="settings.site" />
      <AdminSettingsForm settings-key="contact" :initial="settings.contact" />
      <AdminSettingsForm settings-key="socials" :initial="settings.socials" />

      <section class="rounded-xl border border-line bg-surface/50 p-6">
        <h2 class="text-xl font-semibold">Résumé</h2>
        <p class="mt-2 text-muted">
          <template v-if="settings.resume">Current file: <a :href="settings.resume.url" target="_blank" class="link">{{ settings.resume.name }}</a></template>
          <template v-else>No résumé uploaded. Add a PDF and a download button appears on the About page and homepage.</template>
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <label class="btn btn-ghost">
            <Icon name="lucide:upload" size="16" /> {{ resumeBusy ? "Uploading…" : settings.resume ? "Replace PDF" : "Upload PDF" }}
            <input type="file" accept="application/pdf" class="sr-only" :disabled="resumeBusy" @change="uploadResume" />
          </label>
          <button v-if="settings.resume" type="button" class="btn btn-danger" @click="removeResume">Remove</button>
        </div>
        <p v-if="resumeMessage" class="mt-3 text-danger" role="alert">{{ resumeMessage }}</p>
      </section>
    </div>
  </div>
</template>
