type Crumb = { name: string; path: string };

// Title, description, canonical URL, link previews and structured data for one page, set together
export function usePageSeo(options: {
  title?: string;
  description: string;
  image?: string | null;
  type?: "website" | "article";
  breadcrumbs?: Crumb[];
  jsonLd?: Record<string, unknown>[];
}) {
  const site = useSite();
  const route = useRoute();
  const base = useRuntimeConfig().public.siteUrl.replace(/\/$/, "");
  const absolute = (path: string) => base + (path === "/" ? "/" : path.replace(/\/$/, ""));
  const url = absolute(route.path);
  const fullTitle = options.title ? `${options.title} | ${site.value.site.name}` : `${site.value.site.name} | ${site.value.site.role}`;
  const image = options.image || `${base}/og-default.png`;

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: fullTitle,
    ogDescription: options.description,
    ogUrl: url,
    ogType: options.type ?? "website",
    ogImage: image,
    twitterCard: "summary_large_image",
    twitterTitle: fullTitle,
    twitterDescription: options.description,
    twitterImage: image,
  });

  const graph = [...(options.jsonLd ?? [])];
  if (options.breadcrumbs?.length) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [{ name: "Home", path: "/" }, ...options.breadcrumbs].map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: absolute(crumb.path),
      })),
    });
  }

  useHead({
    link: [{ rel: "canonical", href: url }],
    script: graph.length ? [jsonLdScript({ "@context": "https://schema.org", "@graph": graph }, "page-ld")] : [],
  });
}

// "<" is escaped so stored content can never close the script element
export function jsonLdScript(data: Record<string, unknown>, key: string) {
  return { key, type: "application/ld+json" as const, innerHTML: JSON.stringify(data).replace(/</g, "\\u003c") };
}

export function personId() {
  return `${useRuntimeConfig().public.siteUrl.replace(/\/$/, "")}/#person`;
}
