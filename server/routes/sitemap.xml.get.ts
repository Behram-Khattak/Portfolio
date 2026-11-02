import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, "");
  const db = useDb();
  const { posts, projects, services } = schema;
  const published = (table: typeof posts | typeof projects | typeof services) =>
    db.select({ slug: table.slug, updatedAt: table.updatedAt }).from(table).where(eq(table.published, true));
  const [serviceRows, projectRows, postRows] = await Promise.all([published(services), published(projects), published(posts)]);

  const day = (date: Date) => date.toISOString().slice(0, 10);
  const latest = (rows: { updatedAt: Date }[]) => (rows.length ? day(new Date(Math.max(...rows.map((row) => row.updatedAt.getTime())))) : undefined);
  const entries: { path: string; lastmod?: string }[] = [
    { path: "/", lastmod: latest([...serviceRows, ...projectRows]) },
    { path: "/services", lastmod: latest(serviceRows) },
    ...serviceRows.map((row) => ({ path: `/services/${row.slug}`, lastmod: day(row.updatedAt) })),
    { path: "/projects", lastmod: latest(projectRows) },
    ...projectRows.map((row) => ({ path: `/projects/${row.slug}`, lastmod: day(row.updatedAt) })),
    { path: "/blog", lastmod: latest(postRows) },
    ...postRows.map((row) => ({ path: `/blog/${row.slug}`, lastmod: day(row.updatedAt) })),
    { path: "/about" },
    { path: "/contact" },
  ];

  setResponseHeader(event, "Content-Type", "application/xml; charset=utf-8");
  const url = (entry: (typeof entries)[number]) =>
    `  <url><loc>${siteUrl}${entry.path === "/" ? "/" : entry.path}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}</url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(url).join("\n")}\n</urlset>\n`;
});
