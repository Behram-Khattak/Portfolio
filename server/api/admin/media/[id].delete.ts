import { eq, or, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = parseId(getRouterParam(event, "id"));
  const db = useDb();
  const { experiences, media, posts, projects } = schema;

  const [row] = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (!row) throw createError({ statusCode: 404, statusMessage: "Not found" });

  const [inProjects, inPosts, inExperiences, settings] = await Promise.all([
    db.select({ title: projects.title }).from(projects).where(or(eq(projects.coverMediaId, id), sql`EXISTS (SELECT 1 FROM json_each(${projects.gallery}) WHERE value = ${id})`)),
    db.select({ title: posts.title }).from(posts).where(eq(posts.coverMediaId, id)),
    db.select({ title: experiences.company }).from(experiences).where(eq(experiences.logoMediaId, id)),
    getSettings(),
  ]);
  const usedBy = [...inProjects, ...inPosts, ...inExperiences].map((r) => r.title);
  if (settings.about.profileMediaId === id) usedBy.push("About page");
  if (usedBy.length) {
    throw createError({ statusCode: 409, statusMessage: `Still in use by: ${usedBy.join(", ")}` });
  }

  await db.delete(media).where(eq(media.id, id));
  await useBucket().delete([row.filename, thumbKey(row.filename)]);
  await audit(event, { action: "delete", entity: "media", entityId: id, detail: row.originalName });
  return { ok: true };
});
