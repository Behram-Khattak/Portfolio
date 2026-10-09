<script setup lang="ts">
const site = await useSite();

const socials = computed(() =>
  [
    { label: "GitHub", icon: "simple-icons:github", href: site.value.socials.github },
    { label: "LinkedIn", icon: "simple-icons:linkedin", href: site.value.socials.linkedin },
    { label: "YouTube", icon: "simple-icons:youtube", href: site.value.socials.youtube },
    { label: "X", icon: "simple-icons:x", href: site.value.socials.x },
  ].filter((social) => social.href),
);
</script>

<template>
  <footer class="mt-28">
    <div class="shell"><div class="h-px bg-line" aria-hidden="true" /></div>
    <div class="shell flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="font-display text-xl font-semibold">{{ site.site.name }}</p>
        <p class="mt-1 text-muted">
          {{ site.site.role }}<template v-if="site.contact.location">, {{ site.contact.location }}</template>
        </p>
        <a :href="`mailto:${site.contact.email}`" class="link mt-3 inline-block">{{ site.contact.email }}</a>
      </div>

      <div class="flex flex-col gap-4 md:items-end">
        <ul class="flex gap-2">
          <li v-for="social in socials" :key="social.label">
            <a
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.label"
              class="grid size-10 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Icon :name="social.icon" size="18" />
            </a>
          </li>
        </ul>
        <p class="text-sm text-muted">&copy; {{ new Date().getFullYear() }} {{ site.site.name }}</p>
      </div>
    </div>
  </footer>
</template>
