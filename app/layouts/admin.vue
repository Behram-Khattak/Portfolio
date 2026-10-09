<script setup lang="ts">
const { user, clear } = useUserSession();
const route = useRoute();
const open = ref(false);
watch(() => route.fullPath, () => (open.value = false));

useHead({ titleTemplate: (title) => (title ? `${title} | Admin` : "Admin"), meta: [{ name: "robots", content: "noindex, nofollow" }] });

const { data: dashboard, refresh } = await useAsyncData("admin-nav", () => adminFetch("/api/admin/dashboard"));
watch(() => route.path, () => refresh());

const nav = [
  { to: "/admin", label: "Dashboard", icon: "lucide:house", exact: true },
  { to: "/admin/projects", label: "Projects", icon: "lucide:folder-kanban" },
  { to: "/admin/posts", label: "Blog posts", icon: "lucide:pen-line" },
  { to: "/admin/services", label: "Services", icon: "lucide:layers" },
  { to: "/admin/media", label: "Images", icon: "lucide:image" },
  { to: "/admin/content", label: "Page content", icon: "lucide:file-text" },
  { to: "/admin/experiences", label: "Experience", icon: "lucide:briefcase" },
  { to: "/admin/skills", label: "Skills", icon: "lucide:wrench" },
  { to: "/admin/inquiries", label: "Inquiries", icon: "lucide:inbox" },
  { to: "/admin/settings", label: "Settings", icon: "lucide:settings" },
];
const isActive = (item: (typeof nav)[number]) => (item.exact ? route.path === item.to : route.path.startsWith(item.to));

async function signOut() {
  await $fetch("/api/auth/logout", { method: "POST" });
  await clear();
  await navigateTo("/admin/login");
}
</script>

<template>
  <div class="min-h-screen md:grid md:grid-cols-[15rem_1fr]">
    <div class="flex items-center justify-between border-b border-line px-4 py-3 md:hidden">
      <span class="font-display text-lg font-semibold">Admin</span>
      <button type="button" class="grid size-10 place-items-center" :aria-expanded="open" aria-label="Menu" @click="open = !open">
        <Icon :name="open ? 'lucide:x' : 'lucide:menu'" size="22" />
      </button>
    </div>

    <aside :class="[open ? 'block' : 'hidden', 'border-b border-line bg-surface md:sticky md:top-0 md:block md:h-screen md:border-b-0 md:border-r']">
      <div class="flex h-full flex-col p-4">
        <p class="hidden px-3 pb-4 pt-2 font-display text-xl font-semibold md:block">Admin</p>
        <nav class="flex-1 space-y-1" aria-label="Admin">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            :class="['flex items-center gap-3 rounded-lg px-3 py-2 text-[0.95rem]', isActive(item) ? 'bg-raised text-fg' : 'text-muted hover:text-fg']"
            :aria-current="isActive(item) ? 'page' : undefined"
          >
            <Icon :name="item.icon" size="18" />
            <span class="flex-1">{{ item.label }}</span>
            <span v-if="item.to === '/admin/inquiries' && dashboard?.counts.unread" class="rounded-full bg-accent px-2 text-xs font-semibold text-on-accent">
              {{ dashboard.counts.unread }}
            </span>
          </NuxtLink>
        </nav>
        <div class="mt-4 space-y-1 border-t border-line pt-4">
          <p class="truncate px-3 text-sm text-muted">{{ user?.email }}</p>
          <a href="/" target="_blank" class="flex items-center gap-3 rounded-lg px-3 py-2 text-[0.95rem] text-muted hover:text-fg">
            <Icon name="lucide:external-link" size="18" /> View site
          </a>
          <button type="button" class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[0.95rem] text-muted hover:text-fg" @click="signOut">
            <Icon name="lucide:log-out" size="18" /> Sign out
          </button>
        </div>
      </div>
    </aside>

    <main class="min-w-0 p-5 md:p-10">
      <slot />
    </main>
  </div>
</template>
