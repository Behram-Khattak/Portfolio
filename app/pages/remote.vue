<script setup lang="ts">
const { data: home } = await useFetch("/api/home");
const { data: about } = await useFetch("/api/about");
const base = useRuntimeConfig().public.siteUrl.replace(/\/$/, "");

usePageSeo({
  title: "Hire a Remote Full-Stack Developer",
  description: "Remote web, mobile and AI development for businesses worldwide, from a full-stack developer in Doha who works across time zones.",
  breadcrumbs: [{ name: "Working remotely", path: "/remote" }],
  jsonLd: [
    {
      "@type": "Service",
      name: "Remote full-stack development",
      serviceType: "Software development",
      description: "Websites, custom web applications, mobile apps and AI features, built remotely for businesses anywhere.",
      url: `${base}/remote`,
      provider: { "@id": personId() },
      areaServed: "Worldwide",
    },
  ],
});
</script>

<template>
  <div>
    <PageIntro title="Work with me remotely" lead="Wherever your business is, I can plan, build and run your website, web app, mobile app or AI features from Doha.">
      <div class="mt-8 flex flex-wrap gap-3">
        <BriefButton kind="consultation" class="btn btn-primary">Book a free consultation</BriefButton>
        <BriefButton class="btn btn-ghost">Start a project</BriefButton>
      </div>
    </PageIntro>

    <section v-if="home?.services.length" class="shell mt-20">
      <SectionHeading title="What I build." sub="For clients anywhere." />
      <ul class="mt-10 grid gap-5 md:grid-cols-2">
        <li v-for="service in home.services" :key="service.slug">
          <NuxtLink :to="`/services/${service.slug}`" class="lift flex h-full items-start gap-4 rounded-2xl border border-line bg-surface p-6">
            <Icon :name="service.icon" size="24" class="mt-1 shrink-0 text-accent" />
            <span>
              <span class="block text-xl font-medium">{{ service.title }}</span>
              <span class="mt-1 block text-muted">{{ service.tagline }}</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <RemoteWorking />

    <section class="shell mt-24">
      <SectionHeading title="How a project runs." sub="Four clear steps." />
      <ol class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(step, index) in processSteps" :key="step.title" class="rounded-2xl border border-line p-6">
          <span class="font-mono text-sm text-muted">Step {{ index + 1 }}</span>
          <h3 class="mt-2 text-xl font-medium">{{ step.title }}</h3>
          <p class="mt-2 text-muted">{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <section v-if="home?.projects.length" class="shell mt-24">
      <SectionHeading title="Selected work." sub="Case studies.">
        <NuxtLink to="/projects" class="link">All projects</NuxtLink>
      </SectionHeading>
      <div class="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2">
        <ProjectTile v-for="project in home.projects" :key="project.slug" :project="project" />
      </div>
    </section>

    <section v-if="about?.skills.length" class="shell mt-24">
      <h2 class="text-3xl font-normal md:text-5xl">Tech stack</h2>
      <ul class="mt-8 flex flex-wrap gap-2.5">
        <li v-for="skill in about.skills" :key="skill.name"><TechBadge :name="skill.name" /></li>
      </ul>
    </section>

    <ContactBand />
  </div>
</template>
