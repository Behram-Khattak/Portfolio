<script setup lang="ts">
const route = useRoute();
const { data, error } = await useFetch(`/api/projects/${route.params.slug}`);
if (error.value || !data.value) throw createError({ statusCode: 404, statusMessage: "Project not found", fatal: true });
const project = data as Ref<NonNullable<typeof data.value>>;

useSeoMeta({
  title: project.value.title,
  description: project.value.summary,
  ogImage: project.value.cover?.url,
});

const body = ref<HTMLElement>();
useCodeCopy(body);

const facts = computed(() =>
  [
    { label: "Client", value: project.value.client },
    { label: "Role", value: project.value.role },
    { label: "Year", value: project.value.year },
  ].filter((fact) => fact.value),
);
</script>

<template>
  <article>
    <PageIntro :title="project.title" :lead="project.summary">
      <div class="mt-8 flex flex-wrap gap-3">
        <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          Visit the site <Icon name="lucide:arrow-up-right" size="16" />
        </a>
        <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
          <Icon name="simple-icons:github" size="16" /> View the code
        </a>
      </div>
    </PageIntro>

    <div class="shell mt-12">
      <img
        v-if="project.cover"
        :src="project.cover.url"
        :alt="project.cover.alt"
        :width="project.cover.width"
        :height="project.cover.height"
        class="w-full rounded-xl border border-line"
      />

      <div class="mt-12 grid gap-12 md:grid-cols-[1.5fr_1fr]">
        <!-- eslint-disable-next-line vue/no-v-html -- rendered server-side with raw HTML disabled -->
        <div v-if="project.bodyHtml" ref="body" class="prose" v-html="project.bodyHtml" />
        <dl v-if="facts.length || project.tech.length || project.service" class="h-fit space-y-4 rounded-xl border border-line bg-surface p-6" :class="{ 'md:col-start-1': !project.bodyHtml }">
          <div v-for="fact in facts" :key="fact.label">
            <dt class="text-sm text-muted">{{ fact.label }}</dt>
            <dd class="text-lg">{{ fact.value }}</dd>
          </div>
          <div v-if="project.tech.length">
            <dt class="text-sm text-muted">Stack</dt>
            <dd class="mt-1.5 flex flex-wrap gap-2"><TechBadge v-for="tech in project.tech" :key="tech" :name="tech" /></dd>
          </div>
          <div v-if="project.service">
            <dt class="text-sm text-muted">Service</dt>
            <dd class="text-lg"><NuxtLink :to="{ path: '/services', hash: `#${project.service.slug}` }" class="link">{{ project.service.title }}</NuxtLink></dd>
          </div>
        </dl>
      </div>

      <div v-if="project.gallery.length" class="mt-14 grid gap-6 md:grid-cols-2">
        <img
          v-for="image in project.gallery"
          :key="image.id"
          :src="image.url"
          :alt="image.alt"
          :width="image.width"
          :height="image.height"
          loading="lazy"
          class="w-full rounded-xl border border-line"
        />
      </div>

      <p class="mt-14"><NuxtLink to="/projects" class="link">All projects</NuxtLink></p>
    </div>

    <ContactBand />
  </article>
</template>
