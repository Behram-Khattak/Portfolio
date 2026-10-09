<script setup lang="ts">
const site = await useSite();
const { public: { siteUrl } } = useRuntimeConfig();

useHead({
  titleTemplate: (title) => (title ? `${title} | ${site.value.site.name}` : `${site.value.site.name} | ${site.value.site.role}`),
  script: [
    {
      type: "application/ld+json",
      // "<" is escaped so stored settings can never close the script element
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: site.value.site.name,
        jobTitle: site.value.site.role,
        description: site.value.site.description,
        url: siteUrl,
        email: site.value.contact.email,
        sameAs: Object.values(site.value.socials).filter(Boolean),
      }).replace(/</g, "\\u003c"),
    },
  ],
});
useSeoMeta({
  description: site.value.site.description,
  ogSiteName: site.value.site.name,
  ogType: "website",
  twitterCard: "summary",
});
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent">
      Skip to content
    </a>
    <SiteHeader />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
