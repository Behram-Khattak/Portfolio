import { asc, desc } from "drizzle-orm";

export default defineEventHandler(async () => {
  const db = useDb();
  const { experiences, skills } = schema;
  const [settings, experienceRows, skillRows] = await Promise.all([
    getSettings(),
    db.select().from(experiences).orderBy(asc(experiences.sortOrder), desc(experiences.id)),
    db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.id)),
  ]);
  const media = await loadMedia([settings.about.profileMediaId, ...experienceRows.map((row) => row.logoMediaId)]);

  return {
    heading: settings.about.heading,
    bodyHtml: renderMarkdown(settings.about.body),
    profile: (settings.about.profileMediaId && media.get(settings.about.profileMediaId)) || null,
    experiences: experienceRows.map((row) => ({
      company: row.company,
      role: row.role,
      timeline: row.timeline,
      summary: row.summary,
      link: row.link,
      logo: (row.logoMediaId && media.get(row.logoMediaId)) || null,
    })),
    skills: skillRows.map(({ name, icon, category }) => ({ name, icon, category })),
  };
});
