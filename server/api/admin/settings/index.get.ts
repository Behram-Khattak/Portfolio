export default defineEventHandler(async () => {
  const [settings, resume] = await Promise.all([getSettings(), getResume()]);
  return { ...settings, resume: resume ? { name: resume.name, url: mediaUrl(resume.file) } : null };
});
