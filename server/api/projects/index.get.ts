export default defineEventHandler(async () => {
  const [projects, services] = await Promise.all([publishedProjects(), publishedServices()]);
  const used = new Set(projects.map((project) => project.service));
  return {
    projects,
    // Only services that actually have projects are offered as filters
    services: services.filter((service) => used.has(service.slug)).map(({ slug, title }) => ({ slug, title })),
  };
});
