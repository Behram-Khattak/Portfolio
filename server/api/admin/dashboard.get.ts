import { count, desc, eq } from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";

export default defineEventHandler(async (event) => {
  const db = useDb();
  const { auditLogs, inquiries, media, posts, projects, services } = schema;
  const total = (table: SQLiteTable) =>
    db.select({ total: count() }).from(table).then((rows) => rows[0]?.total ?? 0);

  const [projectCount, postCount, serviceCount, mediaCount, unread, recentInquiries, activity] = await Promise.all([
    total(projects),
    total(posts),
    total(services),
    total(media),
    db.select({ total: count() }).from(inquiries).where(eq(inquiries.isRead, false)).then((rows) => rows[0]?.total ?? 0),
    db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(5),
    db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(15),
  ]);

  return {
    login: String(event.context.admin?.login ?? ""),
    counts: { projects: projectCount, posts: postCount, services: serviceCount, media: mediaCount, unread },
    recentInquiries,
    activity,
  };
});
