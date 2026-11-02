<script setup lang="ts">
const route = useRoute();
const { public: { seo } } = useRuntimeConfig();
const { data, error } = await useFetch(`/api/services/${route.params.slug}`);
if (error.value || !data.value) throw createError({ statusCode: 404, statusMessage: "Service not found", fatal: true });
const service = computed(() => data.value!);

const heading = computed(() => `${service.value.title} in ${seo.area}`);
const paragraphs = computed(() => service.value.description.split(/\n{2,}/));
const base = useRuntimeConfig().public.siteUrl.replace(/\/$/, "");

usePageSeo({
  title: service.value.metaTitle || heading.value,
  description: service.value.metaDescription || `${service.value.tagline} ${service.value.title} for businesses in ${seo.area}, from a full-stack developer based in ${seo.locality}.`,
  breadcrumbs: [
    { name: "Services", path: "/services" },
    { name: service.value.title, path: `/services/${service.value.slug}` },
  ],
  jsonLd: [
    {
      "@type": "Service",
      name: heading.value,
      serviceType: service.value.title,
      description: service.value.description,
      url: `${base}/services/${service.value.slug}`,
      provider: { "@id": personId() },
      areaServed: { "@type": "Country", name: seo.area },
    },
  ],
});
</script>

<template>
  <div>
    <PageIntro :title="heading" :lead="service.tagline">
      <div class="mt-8 flex flex-wrap gap-3">
        <BriefButton kind="consultation" :service="service.title" class="btn btn-primary">Book a free consultation</BriefButton>
        <BriefButton :service="service.title" class="btn btn-ghost">Get a quote</BriefButton>
      </div>
    </PageIntro>

    <section class="shell mt-16 grid items-center gap-10 md:mt-20 lg:grid-cols-2 lg:gap-16">
      <div>
        <div class="prose">
          <p v-for="paragraph in paragraphs" :key="paragraph">{{ paragraph }}</p>
        </div>
        <h2 class="mt-10 text-2xl font-normal md:text-3xl">What's included</h2>
        <ul class="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <li v-for="item in service.deliverables" :key="item" class="flex gap-2.5">
            <Icon name="lucide:check" size="18" class="mt-1 shrink-0 text-ok" />
            {{ item }}
          </li>
        </ul>
      </div>
      <ServiceGraphic :slug="service.slug" :icon="service.icon" />
    </section>

    <section v-if="service.projects.length" class="shell mt-24">
      <SectionHeading :title="`${service.title} I've built.`" sub="Selected work." />
      <div class="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2">
        <ProjectTile v-for="project in service.projects" :key="project.slug" :project="project" />
      </div>
    </section>

    <section v-if="service.faqs.length" class="shell mt-24">
      <h2 class="text-3xl font-normal md:text-5xl">Questions clients ask</h2>
      <div class="mt-8 divide-y divide-line border-y border-line">
        <details v-for="faq in service.faqs" :key="faq.question" class="group py-5">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-lg md:text-xl">
            {{ faq.question }}
            <Icon name="lucide:plus" size="20" class="shrink-0 transition-transform group-open:rotate-45" />
          </summary>
          <p class="mt-3 max-w-[68ch] whitespace-pre-line text-muted">{{ faq.answer }}</p>
        </details>
      </div>
    </section>

    <nav class="shell mt-24" aria-label="Other services">
      <h2 class="text-2xl font-normal md:text-3xl">Other services</h2>
      <ul class="mt-6 flex flex-wrap gap-2.5">
        <li v-for="other in service.others" :key="other.slug">
          <NuxtLink :to="`/services/${other.slug}`" class="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 transition-colors hover:border-accent hover:text-accent">
            <Icon :name="other.icon" size="16" class="text-accent" /> {{ other.title }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <ContactBand />
  </div>
</template>
