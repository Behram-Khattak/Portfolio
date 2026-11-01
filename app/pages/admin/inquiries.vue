<script setup lang="ts">
definePageMeta({ layout: "admin" });
useHead({ title: "Inquiries" });

const { data: items, refresh } = await useAsyncData("admin-inquiries", () => adminFetch("/api/admin/inquiries"));
const failure = ref("");

const detailLabels: Record<string, string> = {
  services: "Looking for",
  stage: "Project stage",
  features: "Should include",
  timeline: "Timeline",
  preferredDate: "Preferred date",
  preferredTime: "Preferred time",
  meetingType: "Meet by",
  timezone: "Time zone",
  phone: "Phone",
  contactMethod: "Reach them by",
  companySize: "Company size",
  website: "Website",
};
const detailRows = (details: Record<string, unknown>) =>
  Object.keys(detailLabels)
    .filter((key) => details?.[key])
    .map((key) => {
      const value = details[key];
      if (key === "preferredDate") return { label: detailLabels[key], value: formatDate(String(value)) };
      return { label: detailLabels[key], value: Array.isArray(value) ? value.join(", ") : String(value) };
    });

async function setRead(id: number, isRead: boolean) {
  failure.value = "";
  try {
    await adminFetch(`/api/admin/inquiries/${id}`, { method: "PUT", body: { isRead } });
    await Promise.all([refresh(), refreshNuxtData("admin-nav")]);
  } catch (error) {
    failure.value = errorMessage(error);
  }
}

async function remove(item: { id: number; name: string }) {
  if (!confirm(`Delete the message from ${item.name}? This cannot be undone.`)) return;
  failure.value = "";
  try {
    await adminFetch(`/api/admin/inquiries/${item.id}`, { method: "DELETE" });
    await Promise.all([refresh(), refreshNuxtData("admin-nav")]);
  } catch (error) {
    failure.value = errorMessage(error);
  }
}
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="admin-title">Inquiries</h1>
    <p v-if="failure" class="mt-4 text-danger" role="alert">{{ failure }}</p>
    <p v-if="!items?.length" class="mt-8 text-muted">No inquiries yet. Project briefs and consultation requests appear here.</p>

    <ul class="mt-8 space-y-4">
      <li v-for="item in items" :key="item.id" :class="['admin-card p-4', { 'border-l-2 border-l-accent': !item.isRead }]">
        <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 class="admin-section">{{ item.name }}</h2>
          <span :class="['rounded-md px-1.5 text-[0.8125rem]', item.kind === 'consultation' ? 'bg-accent text-on-accent' : 'bg-raised']">{{ item.kind === "consultation" ? "Consultation" : "Project" }}</span>
          <a :href="`mailto:${item.email}`" class="text-muted hover:text-fg">{{ item.email }}</a>
          <span class="ml-auto text-sm text-muted">{{ formatDateTime(item.createdAt) }}</span>
        </div>
        <p v-if="item.company || item.service || item.budget" class="mt-1 text-sm text-muted">
          {{ [item.company, item.service, item.budget].filter(Boolean).join(", ") }}
        </p>
        <dl v-if="detailRows(item.details).length" class="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-[9rem_1fr]">
          <template v-for="row in detailRows(item.details)" :key="row.label">
            <dt class="text-muted">{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </template>
        </dl>
        <p v-if="item.message" class="mt-4 whitespace-pre-wrap">{{ item.message }}</p>
        <div class="mt-5 flex flex-wrap gap-2">
          <a :href="`mailto:${item.email}?subject=${encodeURIComponent('Re: your inquiry')}`" class="btn btn-ghost btn-sm">Reply by email</a>
          <button type="button" class="btn btn-ghost btn-sm" @click="setRead(item.id, !item.isRead)">{{ item.isRead ? "Mark as unread" : "Mark as read" }}</button>
          <button type="button" class="btn btn-danger btn-sm" @click="remove(item)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>
