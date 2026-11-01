// Global data used by the layout on every page
export default defineEventHandler(async (): Promise<SiteData> => {
  const [settings, resume, services] = await Promise.all([getSettings(), getResume(), publishedServices()]);
  return {
    site: settings.site,
    contact: settings.contact,
    socials: settings.socials,
    resumeUrl: resume ? mediaUrl(resume.file) : "",
    services: services.map(({ title, icon, tagline }) => ({ title, icon, tagline })),
  };
});
