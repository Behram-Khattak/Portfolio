export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") ?? "";
  const [services, projects] = await Promise.all([publishedServices(), publishedProjects()]);
  const service = services.find((entry) => entry.slug === slug);
  if (!service) throw createError({ statusCode: 404, statusMessage: "Service not found" });

  const { title, tagline, description, icon, deliverables, metaTitle, metaDescription, faqs, updatedAt } = service;
  return {
    slug,
    title,
    tagline,
    description,
    icon,
    deliverables,
    metaTitle,
    metaDescription,
    faqs,
    updatedAt,
    projects: projects.filter((project) => project.service === slug),
    others: services.filter((entry) => entry.slug !== slug).map((entry) => ({ slug: entry.slug, title: entry.title, icon: entry.icon })),
  };
});
