// Global data used by the layout on every page
export default defineEventHandler(async (): Promise<SiteData> => {
  const [settings, resume] = await Promise.all([getSettings(), getResume()]);
  return {
    site: settings.site,
    contact: settings.contact,
    socials: settings.socials,
    resumeUrl: resume ? mediaUrl(resume.file) : "",
  };
});
