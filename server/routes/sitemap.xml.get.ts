export default defineEventHandler(async (event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, "");
  const [projects, posts] = await Promise.all([publishedProjects(), publishedPosts()]);
  const paths = [
    "/", "/services", "/projects", "/blog", "/about", "/contact",
    ...projects.map((p) => `/projects/${p.slug}`),
    ...posts.map((p) => `/blog/${p.slug}`),
  ];
  setResponseHeader(event, "Content-Type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`)
    .join("\n")}\n</urlset>\n`;
});
