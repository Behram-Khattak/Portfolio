<script setup lang="ts">
definePageMeta({ layout: "admin" });
useHead({ title: "Overview" });

const { data } = await useAsyncData("admin-dashboard", () => adminFetch("/api/admin/dashboard"));
const openSearch = inject<() => void>("openAdminSearch");

const rows = computed(() => [
  { label: "Projects", value: data.value?.counts.projects ?? 0, to: "/admin/projects", icon: "lucide:folder-kanban" },
  { label: "Blog posts", value: data.value?.counts.posts ?? 0, to: "/admin/posts", icon: "lucide:pen-line" },
  { label: "Services", value: data.value?.counts.services ?? 0, to: "/admin/services", icon: "lucide:layers" },
  { label: "Images", value: data.value?.counts.media ?? 0, to: "/admin/media", icon: "lucide:image" },
]);
const actionLabels: Record<string, string> = {
  create: "Created", update: "Updated", delete: "Deleted", upload: "Uploaded", publish: "Published", login: "Signed in",
};
</script>

<template>
  <div class="mx-auto max-w-5xl md:pt-10">
    <h1 class="text-center text-[1.75rem] md:text-[2rem]">What are you working on today?</h1>
    <button type="button" class="admin-card mx-auto mt-6 flex h-11 w-full max-w-2xl items-center gap-2.5 px-3.5 text-muted transition-colors hover:border-accent-2" @click="openSearch?.()">
      <Icon name="lucide:search" size="17" />
      <span class="flex-1 text-left">Search pages, posts and projects</span>
      <kbd class="hidden rounded border border-line px-1.5 font-sans text-xs md:inline">⌘K</kbd>
    </button>

    <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
      <section>
        <h2 class="admin-section">Content</h2>
        <ul class="mt-2 divide-y divide-line">
          <li v-for="row in rows" :key="row.label">
            <NuxtLink :to="row.to" class="group flex items-center gap-2.5 py-2.5">
              <Icon :name="row.icon" size="17" class="text-muted" />
              <span class="flex-1 group-hover:text-accent">{{ row.label }}</span>
              <span class="text-muted">{{ row.value }}</span>
              <Icon name="lucide:chevron-right" size="15" class="text-muted" />
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="admin-section">Inbox</h2>
        <p v-if="!data?.recentInquiries.length" class="mt-3 text-muted">Messages from your contact form appear here.</p>
        <ul v-else class="mt-2 divide-y divide-line">
          <li v-for="inquiry in data.recentInquiries" :key="inquiry.id">
            <NuxtLink to="/admin/inquiries" class="group block py-2.5">
              <p class="flex items-center gap-2">
                <span v-if="!inquiry.isRead" class="size-1.5 rounded-full bg-accent" aria-label="Unread" />
                <span class="flex-1 truncate group-hover:text-accent">{{ inquiry.name }}</span>
                <span class="shrink-0 text-[0.8125rem] text-muted">{{ formatDate(inquiry.createdAt) }}</span>
              </p>
              <p class="truncate text-muted">{{ inquiry.message }}</p>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="admin-section">Recent activity</h2>
        <p v-if="!data?.activity.length" class="mt-3 text-muted">Your changes appear here.</p>
        <ul v-else class="mt-2 divide-y divide-line">
          <li v-for="entry in data.activity.slice(0, 6)" :key="entry.id" class="py-2.5">
            <p class="truncate">{{ actionLabels[entry.action] ?? entry.action }} <span class="text-muted">{{ entry.detail || entry.entity }}</span></p>
            <p class="text-[0.8125rem] text-muted">{{ formatDateTime(entry.createdAt) }}</p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
