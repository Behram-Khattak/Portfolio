<script setup lang="ts">
definePageMeta({ layout: "admin" });
useHead({ title: "Inquiries" });

const { data: items, refresh } = await useAsyncData("admin-inquiries", () => adminFetch("/api/admin/inquiries"));
const failure = ref("");

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
    <h1 class="text-3xl font-semibold">Inquiries</h1>
    <p v-if="failure" class="mt-4 text-danger" role="alert">{{ failure }}</p>
    <p v-if="!items?.length" class="mt-8 text-muted">No inquiries yet. Messages sent from the contact form appear here.</p>

    <ul class="mt-8 space-y-4">
      <li v-for="item in items" :key="item.id" :class="['rounded-xl border bg-surface p-5', item.isRead ? 'border-line' : 'border-accent']">
        <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 class="text-lg font-semibold">{{ item.name }}</h2>
          <a :href="`mailto:${item.email}`" class="link">{{ item.email }}</a>
          <span class="ml-auto text-sm text-muted">{{ formatDateTime(item.createdAt) }}</span>
        </div>
        <p v-if="item.company || item.service || item.budget" class="mt-1 text-sm text-muted">
          {{ [item.company, item.service, item.budget].filter(Boolean).join(", ") }}
        </p>
        <p class="mt-4 whitespace-pre-wrap">{{ item.message }}</p>
        <div class="mt-5 flex flex-wrap gap-2">
          <a :href="`mailto:${item.email}?subject=${encodeURIComponent('Re: your inquiry')}`" class="btn btn-primary btn-sm">Reply by email</a>
          <button type="button" class="btn btn-ghost btn-sm" @click="setRead(item.id, !item.isRead)">{{ item.isRead ? "Mark as unread" : "Mark as read" }}</button>
          <button type="button" class="btn btn-danger btn-sm" @click="remove(item)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>
