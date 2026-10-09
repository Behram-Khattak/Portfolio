<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });
useHead({ title: "Dashboard" });

const { data } = await useAsyncData("admin-dashboard", () => adminFetch("/api/admin/dashboard"));
const { data: account } = await useAsyncData("admin-account", () => adminFetch<{ email: string; totpEnabled: boolean }>("/api/admin/account"));

const tiles = computed(() => [
  { label: "Projects", value: data.value?.counts.projects ?? 0, to: "/admin/projects" },
  { label: "Blog posts", value: data.value?.counts.posts ?? 0, to: "/admin/posts" },
  { label: "Services", value: data.value?.counts.services ?? 0, to: "/admin/services" },
  { label: "Images", value: data.value?.counts.media ?? 0, to: "/admin/media" },
  { label: "Unread inquiries", value: data.value?.counts.unread ?? 0, to: "/admin/inquiries" },
]);
const actionLabels: Record<string, string> = {
  create: "Created", update: "Updated", delete: "Deleted", upload: "Uploaded", login: "Signed in", login_failed: "Failed sign-in",
  password_changed: "Password changed", password_change_failed: "Failed password change", "2fa_enabled": "2FA turned on", "2fa_disabled": "2FA turned off",
};
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold">Dashboard</h1>

    <NuxtLink v-if="account && !account.totpEnabled" to="/admin/settings" class="mt-6 flex items-center gap-3 rounded-xl border border-signal/50 bg-surface p-4">
      <Icon name="lucide:shield-check" size="22" class="shrink-0 text-signal" />
      <span>Two-factor authentication is off. <span class="link">Turn it on in Settings</span></span>
    </NuxtLink>

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
            <span :class="entry.action.includes('failed') ? 'text-danger' : ''">{{ actionLabels[entry.action] ?? entry.action }}</span>
            <span class="text-muted">{{ [entry.entity, entry.detail].filter(Boolean).join(": ") }}</span>
            <span class="ml-auto text-sm text-muted">{{ formatDateTime(entry.createdAt) }}, {{ entry.ip }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
