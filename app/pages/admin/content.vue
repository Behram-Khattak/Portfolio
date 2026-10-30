<script setup lang="ts">
definePageMeta({ layout: "admin" });
useHead({ title: "Page content" });

const { data: settings } = await useAsyncData("admin-settings", () => adminFetch("/api/admin/settings"));
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-semibold">Page content</h1>
    <p class="mt-2 text-muted">
      Text for the homepage and About page. Job history and skills have their own lists:
      <NuxtLink to="/admin/experiences" class="link">Experience</NuxtLink>, <NuxtLink to="/admin/skills" class="link">Skills</NuxtLink>.
    </p>
    <div v-if="settings" class="mt-8 space-y-8">
      <AdminSettingsForm settings-key="hero" :initial="settings.hero" />
      <AdminSettingsForm settings-key="about" :initial="settings.about" />
    </div>
  </div>
</template>
