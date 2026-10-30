import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") ?? "";
  const { projects, services } = schema;
  const db = useDb();
  const [project] = await db.select().from(projects).where(and(eq(projects.slug, slug), eq(projects.published, true))).limit(1);
  if (!project) throw createError({ statusCode: 404, statusMessage: "Project not found" });

  const [media, service] = await Promise.all([
    loadMedia([project.coverMediaId, ...project.gallery]),
    project.serviceId
      ? db.select({ slug: services.slug, title: services.title }).from(services).where(and(eq(services.id, project.serviceId), eq(services.published, true))).limit(1).then((rows) => rows[0] ?? null)
      : null,
  ]);

  return {
    ...projectCard(project, media, service?.slug ?? null),
    role: project.role,
    liveUrl: project.liveUrl,
    repoUrl: project.repoUrl,
    bodyHtml: project.body ? renderMarkdown(project.body) : "",
    gallery: project.gallery.map((id) => media.get(id)).filter((item) => item !== undefined),
    service,
  };
});
