<script setup lang="ts">
const { data: services } = await useFetch("/api/services");
useSeoMeta({
  title: "Services",
  description: "Website development, custom web applications, mobile apps and AI integration.",
});
</script>

<template>
  <div>
    <PageIntro title="Services" lead="One engineer for the whole job: design, backend, frontend, AI features and the servers it all runs on.">
      <!-- Jump links to each service on this page -->
      <nav v-if="services?.length" class="mt-8 flex flex-wrap gap-2.5" aria-label="Services on this page">
        <a
          v-for="service in services"
          :key="service.slug"
          :href="`#${service.slug}`"
          class="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[0.95rem] transition-colors hover:border-accent hover:text-accent"
        >
          <Icon :name="service.icon" size="16" class="text-accent" /> {{ service.title }}
        </a>
      </nav>
    </PageIntro>

    <div class="shell mt-16 space-y-20 md:mt-24 md:space-y-28">
      <p v-if="!services?.length" class="text-muted">Services will be listed here soon.</p>

      <!-- Illustration and text swap sides on alternate rows -->
      <article v-for="(service, index) in services" :id="service.slug" :key="service.slug" class="grid scroll-mt-8 items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <ServiceGraphic :slug="service.slug" :icon="service.icon" :class="{ 'lg:order-2': index % 2 === 1 }" />

        <div>
          <span class="grid size-12 place-items-center rounded-xl bg-accent/12 text-accent ring-1 ring-inset ring-accent/25">
            <Icon :name="service.icon" size="24" />
          </span>
          <h2 class="mt-5 text-3xl font-normal md:text-4xl">{{ service.title }}</h2>
          <p class="mt-3 max-w-[46ch] text-lg">{{ service.tagline }}</p>
          <div class="prose mt-3 !text-[1rem] !leading-relaxed text-muted">
            <p v-for="paragraph in service.description.split(/\n{2,}/)" :key="paragraph">{{ paragraph }}</p>
          </div>

          <ul v-if="service.deliverables.length" class="mt-6 grid gap-x-6 gap-y-3 border-t border-line pt-6 sm:grid-cols-2">
            <li v-for="item in service.deliverables" :key="item" class="flex gap-2.5">
              <Icon name="lucide:check" size="18" class="mt-1 shrink-0 text-ok" />
              {{ item }}
            </li>
          </ul>

          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/contact" class="btn btn-primary">Get a quote</NuxtLink>
            <NuxtLink to="/projects" class="btn btn-ghost">See my work</NuxtLink>
          </div>
        </div>
      </article>
    </div>

    <ContactBand />
  </div>
</template>
