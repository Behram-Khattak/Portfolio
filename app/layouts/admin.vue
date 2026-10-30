<script setup lang="ts">
const route = useRoute();
const drawerOpen = ref(false);
watch(() => route.fullPath, () => (drawerOpen.value = false));

useHead({ titleTemplate: (title) => (title ? `${title} | Admin` : "Admin"), meta: [{ name: "robots", content: "noindex, nofollow" }] });

const { data: dashboard, refresh } = await useAsyncData("admin-nav", () => adminFetch("/api/admin/dashboard"));
watch(() => route.path, () => refresh());

const isActive = (item: { to: string; exact?: boolean }) => (item.exact ? route.path === item.to : route.path.startsWith(item.to));

const collapsed = ref(false);
try {
  collapsed.value = localStorage.getItem("admin-sidebar") === "collapsed";
} catch {
  // Storage can be blocked, and the sidebar simply starts open
}
function toggleSidebar() {
  collapsed.value = !collapsed.value;
  try {
    localStorage.setItem("admin-sidebar", collapsed.value ? "collapsed" : "open");
  } catch {
    // Only the preference is lost
  }
}

const crumbs = computed(() => {
  const item = adminNav.flatMap((group) => group.items).find(isActive);
  const leaf = route.params.id ? (route.params.id === "new" ? "New" : "Edit") : "";
  return [item, leaf ? { label: leaf } : null].filter((crumb) => crumb !== null && crumb !== undefined) as { label: string; to?: string }[];
});

// Edits are saved at once, but the public site only changes when it is rebuilt
const hasUnpublished = computed(() => {
  const latest = dashboard.value?.activity.find((entry) => !["inquiries", "session"].includes(entry.entity));
  return Boolean(latest) && latest?.action !== "publish";
});
const publishing = ref(false);
const publishMessage = ref("");

async function publish() {
  publishMessage.value = "";
  publishing.value = true;
  try {
    await adminFetch("/api/admin/publish", { method: "POST" });
    publishMessage.value = "Live in a few minutes";
    await refresh();
  } catch (error) {
    publishMessage.value = errorMessage(error, "The rebuild could not be started.");
  } finally {
    publishing.value = false;
  }
}

async function signOut() {
  await $fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/";
}

const palette = ref<{ show: () => void }>();
provide("openAdminSearch", () => palette.value?.show());
</script>

<template>
  <div class="admin-shell md:flex">
    <!-- Dims the page behind the sidebar on phones -->
    <button v-if="drawerOpen" type="button" class="fixed inset-0 z-30 bg-black/40 md:hidden" aria-label="Close menu" @click="drawerOpen = false" />

    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-line bg-surface transition-transform duration-200 motion-reduce:transition-none md:sticky md:top-0 md:z-auto md:h-screen md:shrink-0 md:translate-x-0',
        drawerOpen ? 'translate-x-0' : '-translate-x-full',
        collapsed ? 'md:w-14' : 'md:w-60',
      ]"
    >
      <NuxtLink to="/admin" :class="['flex h-14 shrink-0 items-center gap-2.5 border-b border-line', collapsed ? 'md:justify-center' : 'px-4', 'px-4 md:px-0', !collapsed && 'md:px-4']">
        <span class="grid size-7 shrink-0 place-items-center rounded-md bg-fg text-[0.8125rem] font-medium text-surface" aria-hidden="true">B</span>
        <span :class="['truncate font-medium', collapsed && 'md:hidden']">behramkttk.dev</span>
      </NuxtLink>

      <div class="p-3">
        <button
          type="button"
          :class="['flex h-9 w-full items-center gap-2 rounded-lg border border-line bg-surface text-muted transition-colors hover:bg-raised', collapsed ? 'md:justify-center md:px-0' : '', 'px-2.5']"
          aria-label="Quick search"
          @click="palette?.show()"
        >
          <Icon name="lucide:search" size="16" class="shrink-0" />
          <span :class="['flex-1 text-left', collapsed && 'md:hidden']">Quick search</span>
          <kbd :class="['hidden font-sans text-xs md:inline', collapsed && 'md:hidden']">⌘K</kbd>
        </button>
      </div>

      <nav class="min-h-0 flex-1 overflow-y-auto px-3 pb-3" aria-label="Admin">
        <div v-for="(group, index) in adminNav" :key="index" :class="{ 'mt-4': index > 0 }">
          <p v-if="group.title" :class="['px-2.5 pb-1 text-[0.8125rem] text-muted', collapsed && 'md:hidden']">{{ group.title }}</p>
          <ul class="space-y-0.5">
            <li v-for="item in group.items" :key="item.to">
              <NuxtLink :to="item.to" :class="['admin-nav-item', collapsed && 'md:justify-center md:px-0']" :aria-current="isActive(item) ? 'page' : undefined" :title="collapsed ? item.label : undefined">
                <Icon :name="item.icon" size="17" class="shrink-0 text-muted" />
                <span :class="['flex-1 truncate', collapsed && 'md:sr-only']">{{ item.label }}</span>
                <span v-if="item.to === '/admin/inquiries' && dashboard?.counts.unread" :class="['rounded-full bg-accent px-1.5 text-xs font-medium text-on-accent', collapsed && 'md:hidden']">
                  {{ dashboard.counts.unread }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="hidden border-t border-line p-3 md:block">
        <button type="button" class="admin-nav-item w-full justify-center" :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'" :aria-expanded="!collapsed" @click="toggleSidebar">
          <Icon :name="collapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'" size="17" class="text-muted" />
        </button>
      </div>
    </aside>

    <div class="min-w-0 flex-1">
      <header class="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-surface px-3 md:px-6">
        <button type="button" class="grid size-9 place-items-center rounded-lg hover:bg-raised md:hidden" aria-label="Open menu" :aria-expanded="drawerOpen" @click="drawerOpen = true">
          <Icon name="lucide:menu" size="20" />
        </button>

        <nav class="hidden min-w-0 flex-1 md:block" aria-label="Breadcrumb">
          <ol class="flex items-center gap-1.5">
            <li v-for="(crumb, index) in crumbs" :key="crumb.label" class="flex min-w-0 items-center gap-1.5">
              <Icon v-if="index > 0" name="lucide:chevron-right" size="14" class="text-muted" />
              <NuxtLink v-if="crumb.to && index < crumbs.length - 1" :to="crumb.to" class="truncate text-muted hover:text-fg">{{ crumb.label }}</NuxtLink>
              <span v-else class="truncate font-medium">{{ crumb.label }}</span>
            </li>
          </ol>
        </nav>
        <span class="flex-1 md:hidden" />

        <p v-if="publishMessage || hasUnpublished" class="hidden items-center gap-1.5 text-[0.8125rem] text-muted lg:flex" role="status">
          <span v-if="!publishMessage" class="size-1.5 rounded-full bg-signal" aria-hidden="true" />
          {{ publishMessage || "Changes not live yet" }}
        </p>
        <a href="/" target="_blank" class="btn btn-ghost btn-sm hidden sm:inline-flex"><Icon name="lucide:external-link" size="14" /> View site</a>
        <button type="button" :class="['btn btn-sm', hasUnpublished ? 'btn-primary' : 'btn-ghost']" :disabled="publishing" @click="publish">
          {{ publishing ? "Starting…" : "Publish changes" }}
        </button>

        <button type="button" popovertarget="admin-account" class="grid size-8 place-items-center rounded-full bg-raised text-[0.8125rem] font-medium uppercase" aria-label="Account menu">
          {{ dashboard?.login?.charAt(0) || "B" }}
        </button>
        <div id="admin-account" popover class="admin-card fixed inset-[3.5rem_0.75rem_auto_auto] m-0 w-56 p-1.5 text-fg shadow-[0_8px_24px_rgb(0_0_0/0.1)]">
          <p class="truncate px-2.5 py-1.5 text-[0.8125rem] text-muted">{{ dashboard?.login }}</p>
          <a href="/" target="_blank" class="admin-nav-item sm:hidden"><Icon name="lucide:external-link" size="16" class="text-muted" /> View site</a>
          <button type="button" class="admin-nav-item w-full" @click="signOut"><Icon name="lucide:log-out" size="16" class="text-muted" /> Sign out</button>
        </div>
      </header>

      <main class="mx-auto min-w-0 max-w-6xl p-4 md:p-8">
        <p v-if="publishMessage" class="mb-4 text-[0.8125rem] text-muted lg:hidden" role="status">{{ publishMessage }}</p>
        <slot />
      </main>
    </div>

    <AdminCommandPalette ref="palette" />
  </div>
</template>
