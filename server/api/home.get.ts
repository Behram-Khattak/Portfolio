export default defineEventHandler(async () => {
  const [settings, services, projects, posts] = await Promise.all([
    getSettings(),
    publishedServices(),
    publishedProjects({ featured: true }),
    publishedPosts(3),
  ]);
  return {
    hero: settings.hero,
    services: services.map(({ slug, title, tagline, icon, deliverables }) => ({ slug, title, tagline, icon, deliverables })),
    projects,
    posts,
  };
});
