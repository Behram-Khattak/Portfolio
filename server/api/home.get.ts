export default defineEventHandler(async () => {
  const [settings, services, projects] = await Promise.all([
    getSettings(),
    publishedServices(),
    publishedProjects({ featured: true }),
  ]);
  return {
    hero: settings.hero,
    services: services.map(({ slug, title, tagline, icon, deliverables }) => ({ slug, title, tagline, icon, deliverables })),
    projects,
  };
});
