<script setup lang="ts">
definePageMeta({ layout: "admin" });
useHead({ title: "Dashboard" });

const { data } = await useAsyncData("admin-dashboard", () => adminFetch("/api/admin/dashboard"));

const tiles = computed(() => [
  { label: "Projects", value: data.value?.counts.projects ?? 0, to: "/admin/projects" },
  { label: "Blog posts", value: data.value?.counts.posts ?? 0, to: "/admin/posts" },
  { label: "Services", value: data.value?.counts.services ?? 0, to: "/admin/services" },
  { label: "Images", value: data.value?.counts.media ?? 0, to: "/admin/media" },
  { label: "Unread inquiries", value: data.value?.counts.unread ?? 0, to: "/admin/inquiries" },
]);
const actionLabels: Record<string, string> = {
  create: "Created", update: "Updated", delete: "Deleted", upload: "Uploaded", publish: "Published", login: "Signed in",
};
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold">Dashboard</h1>

    <div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
      <NuxtLink v-for="tile in tiles" :key="tile.label" :to="tile.to" class="rounded-xl border border-line bg-surface p-5 transition-colors hover:border-accent">
        <p class="font-display text-4xl font-semibold">{{ tile.value }}</p>
        <p class="mt-1 text-muted">{{ tile.label }}</p>
      </NuxtLink>
    </div>

    <div class="mt-10 grid gap-10 xl:grid-cols-2">
      <section>
        <h2 class="text-xl font-semibold">Latest inquiries</h2>
        <p v-if="!data?.recentInquiries.length" class="mt-4 text-muted">No inquiries yet. Messages from the contact form appear here.</p>
        <ul v-else class="mt-4 divide-y divide-line rounded-xl border border-line">
          <li v-for="inquiry in data.recentInquiries" :key="inquiry.id">
            <NuxtLink to="/admin/inquiries" class="block p-4 hover:bg-surface">
              <p class="flex items-center gap-2">
                <span v-if="!inquiry.isRead" class="size-2 rounded-full bg-accent" aria-label="Unread" />
                <span class="font-medium">{{ inquiry.name }}</span>
                <span class="ml-auto text-sm text-muted">{{ formatDateTime(inquiry.createdAt) }}</span>
              </p>
              <p class="mt-1 line-clamp-1 text-muted">{{ inquiry.message }}</p>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold">Recent activity</h2>
        <p v-if="!data?.activity.length" class="mt-4 text-muted">Nothing logged yet.</p>
        <ul v-else class="mt-4 divide-y divide-line rounded-xl border border-line text-[0.95rem]">
          <li v-for="entry in data.activity" :key="entry.id" class="flex flex-wrap items-baseline gap-x-2 p-3">
            <span>{{ actionLabels[entry.action] ?? entry.action }}</span>
            <span class="text-muted">{{ [entry.entity, entry.detail].filter(Boolean).join(": ") }}</span>
            <span class="ml-auto text-sm text-muted">{{ formatDateTime(entry.createdAt) }}, {{ entry.ip }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
