<script setup lang="ts">
defineProps<{ project: ProjectCard }>();
</script>

<template>
  <NuxtLink :to="`/projects/${project.slug}`" class="group block">
    <div class="aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface transition duration-200 group-hover:-translate-y-1 group-hover:border-accent group-hover:shadow-[0_22px_44px_-30px_var(--accent)]">
      <img
        v-if="project.cover"
        :src="project.cover.url"
        :alt="project.cover.alt"
        :width="project.cover.width"
        :height="project.cover.height"
        loading="lazy"
        class="size-full object-cover"
      />
      <!-- No screenshot yet: a quiet placeholder rather than an empty box -->
      <div v-else class="pattern glyph-texture grid size-full place-items-center text-muted">
        <Icon name="lucide:image" size="40" />
      </div>
    </div>
    <div class="mt-5 flex items-start justify-between gap-4">
      <div>
        <h3 class="text-2xl font-medium md:text-3xl">{{ project.title }}</h3>
        <ul v-if="project.tech.length" class="mt-2.5 flex flex-wrap gap-2">
          <li v-for="tech in project.tech" :key="tech"><TechBadge :name="tech" /></li>
        </ul>
      </div>
      <span class="grid size-12 shrink-0 place-items-center rounded-full border border-line transition duration-200 group-hover:rotate-45 group-hover:border-fg group-hover:bg-fg group-hover:text-base">
        <Icon name="lucide:arrow-up-right" size="20" />
      </span>
    </div>
    <p class="mt-3 line-clamp-3 text-muted">{{ project.summary }}</p>
  </NuxtLink>
</template>

<style scoped>
.pattern {
  background: radial-gradient(20rem 12rem at 100% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%);
}
</style>
