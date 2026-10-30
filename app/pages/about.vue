<script setup lang="ts">
const site = useSite();
const { data } = await useFetch("/api/about");
const about = computed(() => data.value!);

useSeoMeta({ title: "About", description: `${site.value.site.name}, ${site.value.site.role}. Experience, skills and résumé.` });
</script>

<template>
  <div>
    <div class="shell grid gap-10 pt-16 md:grid-cols-[1.5fr_1fr] md:items-start md:pt-24">
      <div>
        <h1 class="max-w-[16ch] text-4xl font-normal md:text-6xl">{{ about.heading }}</h1>
        <div class="prose mt-8" v-html="about.bodyHtml" />
        <div class="mt-9 flex flex-wrap gap-3">
          <a v-if="site.resumeUrl" :href="site.resumeUrl" download class="btn btn-primary"><Icon name="lucide:download" size="16" /> Download résumé</a>
          <a v-if="site.socials.linkedin" :href="site.socials.linkedin" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
            <Icon name="simple-icons:linkedin" size="16" /> LinkedIn
          </a>
          <NuxtLink to="/contact" class="btn btn-ghost">Get in touch</NuxtLink>
        </div>
      </div>
      <div v-if="about.profile" class="avatar relative mx-auto aspect-square w-full max-w-[19rem] md:mx-0 md:justify-self-end">
        <span class="glow" aria-hidden="true" />
        <span class="ring" aria-hidden="true" />
        <span class="orbit" aria-hidden="true"><i /><i /></span>
        <img
          :src="about.profile.url"
          :alt="about.profile.alt"
          :width="about.profile.width"
          :height="about.profile.height"
          class="absolute inset-[10%] size-[80%] rounded-full border-2 border-line object-cover"
        />
      </div>
    </div>

    <section v-if="about.experiences.length" class="shell mt-24">
      <h2 class="text-3xl font-normal md:text-5xl">Experience</h2>
      <ol class="mt-10 grid gap-5 md:grid-cols-2">
        <li v-for="job in about.experiences" :key="job.company + job.timeline" class="lift flex flex-col rounded-2xl border border-line bg-surface p-6 md:p-7">
          <div class="flex items-center justify-between gap-4">
            <div v-if="job.logo" class="inline-flex h-12 items-center rounded-lg bg-white px-3">
              <img :src="job.logo.url" :alt="job.logo.alt" class="max-h-8 w-auto max-w-28 object-contain" loading="lazy" />
            </div>
            <span v-else class="grid size-12 place-items-center rounded-lg bg-raised text-muted"><Icon name="lucide:briefcase" size="22" /></span>
            <span class="rounded-full border border-line px-3 py-1 text-sm text-muted">{{ job.timeline }}</span>
          </div>
          <h3 class="mt-6 text-2xl font-medium">{{ job.role }}</h3>
          <p class="mt-1 text-lg">
            <a v-if="job.link" :href="job.link" target="_blank" rel="noopener noreferrer" class="link">{{ job.company }}</a>
            <template v-else>{{ job.company }}</template>
          </p>
          <p class="mt-4 text-muted">{{ job.summary }}</p>
        </li>
      </ol>
    </section>

    <section v-if="about.skills.length" class="shell mt-24">
      <h2 class="text-3xl font-normal md:text-5xl">Tech Stack</h2>
      <ul class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <li v-for="skill in about.skills" :key="skill.name" class="skill lift flex flex-col items-center rounded-2xl border border-line bg-surface px-4 py-7 text-center">
          <span class="grid size-14 place-items-center rounded-xl bg-raised">
            <Icon :name="skill.icon" size="28" />
          </span>
          <span class="mt-4 text-lg font-medium">{{ skill.name }}</span>
          <span class="text-sm text-muted">{{ skill.category }}</span>
        </li>
      </ul>
    </section>

    <ContactBand />
  </div>
</template>

<style scoped>
.skill:hover :deep(.iconify) {
  color: var(--accent);
}

/* Profile photo: a dashed ring turns slowly one way while two markers orbit the other */
.glow {
  position: absolute;
  inset: -8%;
  border-radius: 9999px;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 30%, transparent), transparent);
}
.ring,
.orbit {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
}
.ring {
  border: 2px dashed color-mix(in srgb, var(--accent) 60%, transparent);
}
.orbit i {
  position: absolute;
  border-radius: 9999px;
}
.orbit i:first-child {
  top: -6px;
  left: calc(50% - 6px);
  width: 12px;
  height: 12px;
  background: var(--accent);
  box-shadow: 0 0 14px var(--accent);
}
.orbit i:last-child {
  bottom: 12%;
  left: 6%;
  width: 8px;
  height: 8px;
  background: var(--signal);
  box-shadow: 0 0 10px var(--signal);
}

@media (prefers-reduced-motion: no-preference) {
  .ring {
    animation: turn 50s linear infinite;
  }
  .orbit {
    animation: turn 16s linear infinite reverse;
  }
  .glow {
    animation: breathe 5s ease-in-out infinite;
  }
}
@keyframes turn {
  to {
    transform: rotate(360deg);
  }
}
@keyframes breathe {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}
</style>
