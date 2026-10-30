<script setup lang="ts">
useSeoMeta({ title: "Projects", description: "Websites, web applications and products I have built." });

const { data } = await useFetch("/api/projects");
const projects = computed(() => data.value!.projects);
const serviceFilters = computed(() => data.value!.services);
const techFilters = computed(() => [...new Set(projects.value.flatMap((project) => project.tech))].sort());

const activeService = ref<string | null>(null);
const activeTech = ref<string | null>(null);
const visible = computed(() =>
  projects.value.filter(
    (project) =>
      (activeService.value === null || project.service === activeService.value) &&
      (activeTech.value === null || project.tech.includes(activeTech.value)),
  ),
);
const chip = (active: boolean) =>
  ["rounded-full border px-3.5 py-1.5 text-sm transition-colors", active ? "border-accent bg-accent text-on-accent" : "border-line text-muted hover:border-accent hover:text-fg"];
</script>

<template>
  <div>
    <PageIntro title="Projects" lead="Work shipped for clients and employers. Open one to see what was built and how." />

    <div class="shell mt-12">
      <div v-if="serviceFilters.length || techFilters.length > 1" class="space-y-3">
        <div v-if="serviceFilters.length" class="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          <button type="button" :class="chip(activeService === null)" :aria-pressed="activeService === null" @click="activeService = null">All types</button>
          <button v-for="service in serviceFilters" :key="service.slug" type="button" :class="chip(activeService === service.slug)" :aria-pressed="activeService === service.slug" @click="activeService = service.slug">
            {{ service.title }}
          </button>
        </div>
        <div v-if="techFilters.length > 1" class="flex flex-wrap gap-2" role="group" aria-label="Filter by technology">
          <button type="button" :class="chip(activeTech === null)" :aria-pressed="activeTech === null" @click="activeTech = null">Any stack</button>
          <button v-for="tech in techFilters" :key="tech" type="button" :class="chip(activeTech === tech)" :aria-pressed="activeTech === tech" @click="activeTech = tech">
            {{ tech }}
          </button>
        </div>
      </div>

      <p v-if="!projects.length" class="mt-10 text-muted">Projects will be listed here soon.</p>
      <p v-else-if="!visible.length" class="mt-10 text-muted">
        No projects match those filters.
        <button type="button" class="link" @click="((activeService = null), (activeTech = null))">Clear filters</button>
      </p>
      <div class="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2 md:[&>*:nth-child(even)]:mt-24">
        <ProjectTile v-for="project in visible" :key="project.slug" :project="project" />
      </div>
    </div>

    <ContactBand />
  </div>
</template>
