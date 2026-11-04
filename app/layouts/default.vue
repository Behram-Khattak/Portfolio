<script setup lang="ts">
const site = useSite();
const { request: brief } = useBrief();
const { public: { siteUrl } } = useRuntimeConfig();

const { public: { seo } } = useRuntimeConfig();
const base = siteUrl.replace(/\/$/, "");
// Kinds of software people search for, listed alongside the services
const specialties = ["Artificial intelligence", "ERP systems", "Content management systems (CMS)", "Point of sale (POS) systems", "Web portals"];

// Who runs the site, shared by every page. Pages add their own structured data with usePageSeo.
useHead({
  titleTemplate: (title) => (title ? `${title} | ${site.value.site.name}` : `${site.value.site.name} | ${site.value.site.role}`),
  script: [
    jsonLdScript(
      {
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebSite", "@id": `${base}/#website`, url: `${base}/`, name: site.value.site.name, publisher: { "@id": personId() } },
          {
            "@type": "Person",
            "@id": personId(),
            name: site.value.site.name,
            jobTitle: site.value.site.role,
            description: site.value.site.description,
            url: `${base}/`,
            email: site.value.contact.email,
            telephone: site.value.contact.phone || undefined,
            address: { "@type": "PostalAddress", addressLocality: seo.locality, addressCountry: seo.country },
            knowsAbout: [...(site.value.services ?? []).map((service) => service.title), ...specialties],
            sameAs: Object.values(site.value.socials).filter(Boolean),
          },
        ],
      },
      "site-ld",
    ),
  ],
});
useSeoMeta({ ogSiteName: site.value.site.name });
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
    <LazyBriefDialog v-if="brief" />
  </div>
</template>
