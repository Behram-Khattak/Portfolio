import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") ?? "";
  const { posts } = schema;
  const [post] = await useDb().select().from(posts).where(and(eq(posts.slug, slug), eq(posts.published, true))).limit(1);
  if (!post) throw createError({ statusCode: 404, statusMessage: "Post not found" });

  const media = await loadMedia([post.coverMediaId]);
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    publishedAt: post.publishedAt,
    readingMinutes: Math.max(1, Math.round(post.body.split(/\s+/).length / 220)),
    cover: (post.coverMediaId && media.get(post.coverMediaId)) || null,
    bodyHtml: renderMarkdown(post.body),
  };
});
