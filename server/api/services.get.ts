export default defineEventHandler(async () => {
  const services = await publishedServices();
  return services.map(({ slug, title, tagline, description, icon, deliverables }) => ({ slug, title, tagline, description, icon, deliverables }));
});
