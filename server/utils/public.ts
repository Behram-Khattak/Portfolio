import { and, asc, desc, eq } from "drizzle-orm";

// Query helpers for the public site. Only published rows ever leave these functions.
const { posts, projects, services } = schema;

export function publishedServices() {
  return useDb().select().from(services).where(eq(services.published, true)).orderBy(asc(services.sortOrder), asc(services.id));
}

export async function publishedProjects(filter: { featured?: boolean } = {}) {
  const rows = await useDb()
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.published, true),
        filter.featured ? eq(projects.featured, true) : undefined,
      ),
    )
    .orderBy(asc(projects.sortOrder), desc(projects.id));
  const [media, serviceRows] = await Promise.all([
    loadMedia(rows.map((row) => row.coverMediaId)),
    publishedServices(),
  ]);
  const slugs = new Map(serviceRows.map((service) => [service.id, service.slug]));
  return rows.map((row) => projectCard(row, media, (row.serviceId && slugs.get(row.serviceId)) || null));
}

export function projectCard(row: typeof projects.$inferSelect, media: Map<number, MediaView>, service: string | null): ProjectCard {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    client: row.client,
    year: row.year,
    tech: row.tech,
    service,
    featured: row.featured,
    cover: (row.coverMediaId && media.get(row.coverMediaId)) || null,
  };
}

export async function publishedPosts(limit = 100) {
  const rows = await useDb()
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  const media = await loadMedia(rows.map((row) => row.coverMediaId));
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    tags: row.tags,
    publishedAt: row.publishedAt,
    readingMinutes: Math.max(1, Math.round(row.body.split(/\s+/).length / 220)),
    cover: (row.coverMediaId && media.get(row.coverMediaId)) || null,
  }));
}
