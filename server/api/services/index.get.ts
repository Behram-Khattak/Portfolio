export default defineEventHandler(async () => {
  const services = await publishedServices();
  return services.map(({ slug, title, tagline, icon, deliverables, description }) => ({
    slug,
    title,
    tagline,
    icon,
    deliverables,
    descriptionHtml: renderMarkdown(description),
  }));
});
