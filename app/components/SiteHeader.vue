<script setup lang="ts">
const links = [
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
];

const open = ref(false);
const route = useRoute();
watch(() => route.fullPath, () => (open.value = false));
</script>

<template>
  <!-- Transparent and in normal flow: it scrolls away with the page, and the homepage hero slides up underneath it -->
  <header class="relative z-40">
    <div class="shell flex h-20 items-center justify-between gap-4">
      <NuxtLink to="/" class="font-mono text-[0.95rem] underline decoration-accent-2 decoration-wavy underline-offset-4">
        behramkttk.dev
      </NuxtLink>

      <nav class="hidden items-center gap-9 md:flex" aria-label="Main">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="border-b border-transparent pb-0.5 text-[0.95rem] text-muted transition-colors hover:text-fg"
          active-class="!border-fg !text-fg"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <BriefButton class="mr-3 hidden items-center gap-2 border-b border-fg pb-1 text-[0.95rem] font-medium transition-opacity hover:opacity-70 lg:inline-flex">
          Start a project <Icon name="lucide:arrow-up-right" size="16" />
        </BriefButton>
        <BriefButton kind="consultation" class="btn btn-primary btn-sm hidden sm:inline-flex">Book a free consultation</BriefButton>
        <button
          type="button"
          class="grid size-10 place-items-center rounded-full text-fg md:hidden"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          aria-label="Menu"
          @click="open = !open"
        >
          <Icon :name="open ? 'lucide:x' : 'lucide:menu'" size="22" />
        </button>
      </div>
    </div>

    <!-- Overlays the page instead of pushing it down, so it needs its own background -->
    <nav v-show="open" id="mobile-nav" class="absolute inset-x-0 top-full border-y border-line bg-base/95 backdrop-blur md:hidden" aria-label="Mobile">
      <div class="shell flex flex-col py-3">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="py-3 text-lg">{{ link.label }}</NuxtLink>
        <BriefButton kind="consultation" class="btn btn-primary mt-3">Book a free consultation</BriefButton>
        <BriefButton class="btn btn-ghost mt-2">Start a project</BriefButton>
      </div>
    </nav>
  </header>
</template>
