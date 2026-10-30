<script setup lang="ts">
type Result = { label: string; hint: string; icon: string; to: string };

const dialog = ref<HTMLDialogElement>();
const input = ref<HTMLInputElement>();
const query = ref("");
const active = ref(0);
const content = ref<Result[]>([]);

const pages: Result[] = adminNav.flatMap((group) => group.items.map((item) => ({ label: item.label, hint: group.title ?? "Page", icon: item.icon, to: item.to })));
const actions: Result[] = [
  { label: "New blog post", hint: "Action", icon: "lucide:plus", to: "/admin/posts/new" },
  { label: "New project", hint: "Action", icon: "lucide:plus", to: "/admin/projects/new" },
  { label: "New service", hint: "Action", icon: "lucide:plus", to: "/admin/services/new" },
];

const results = computed(() => {
  const term = query.value.trim().toLowerCase();
  const all = [...pages, ...actions, ...content.value];
  return (term ? all.filter((item) => item.label.toLowerCase().includes(term)) : [...actions, ...pages]).slice(0, 9);
});
watch(results, () => (active.value = 0));

async function show() {
  query.value = "";
  dialog.value?.showModal();
  nextTick(() => input.value?.focus());
  try {
    const load = (resource: string, hint: string, icon: string) =>
      adminFetch<{ id: number; title: string }[]>(`/api/admin/${resource}`).then((rows) => rows.map((row) => ({ label: row.title, hint, icon, to: `/admin/${resource}/${row.id}` })));
    content.value = (await Promise.all([load("posts", "Blog post", "lucide:pen-line"), load("projects", "Project", "lucide:folder-kanban"), load("services", "Service", "lucide:layers")])).flat();
  } catch {
    // Pages and actions still work without the content list
  }
}

function go(item: Result | undefined) {
  if (!item) return;
  dialog.value?.close();
  navigateTo(item.to);
}

function onKeydown(event: KeyboardEvent) {
  const count = results.value.length;
  if (event.key === "ArrowDown" && count) active.value = (active.value + 1) % count;
  else if (event.key === "ArrowUp" && count) active.value = (active.value - 1 + count) % count;
  else if (event.key === "Enter") go(results.value[active.value]);
  else return;
  event.preventDefault();
}

function onShortcut(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (dialog.value?.open) dialog.value.close();
    else show();
  }
}
onMounted(() => window.addEventListener("keydown", onShortcut));
onBeforeUnmount(() => window.removeEventListener("keydown", onShortcut));

defineExpose({ show });
</script>

<template>
  <dialog ref="dialog" class="admin-card m-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] overflow-hidden p-0 text-fg shadow-[0_16px_48px_rgb(0_0_0/0.16)] backdrop:bg-black/30" aria-label="Quick search" @click.self="dialog?.close()">
    <div class="flex items-center gap-2.5 border-b border-line px-3.5">
      <Icon name="lucide:search" size="17" class="shrink-0 text-muted" />
      <input
        ref="input"
        v-model="query"
        class="h-12 w-full bg-transparent text-[0.9375rem] outline-none placeholder:text-muted"
        placeholder="Search pages, posts and projects"
        role="combobox"
        aria-expanded="true"
        aria-controls="admin-search-results"
        :aria-activedescendant="results.length ? `admin-result-${active}` : undefined"
        @keydown="onKeydown"
      />
    </div>
    <ul id="admin-search-results" role="listbox" class="max-h-96 overflow-y-auto p-1.5">
      <li
        v-for="(item, index) in results"
        :id="`admin-result-${index}`"
        :key="item.to"
        role="option"
        :aria-selected="index === active"
        :class="['flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2', index === active && 'bg-raised']"
        @mousemove="active = index"
        @click="go(item)"
      >
        <Icon :name="item.icon" size="16" class="shrink-0 text-muted" />
        <span class="flex-1 truncate">{{ item.label }}</span>
        <span class="text-[0.8125rem] text-muted">{{ item.hint }}</span>
      </li>
      <li v-if="!results.length" class="px-2.5 py-6 text-center text-muted">Nothing matches that search.</li>
    </ul>
  </dialog>
</template>
