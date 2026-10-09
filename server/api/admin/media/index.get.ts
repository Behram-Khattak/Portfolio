import { desc } from "drizzle-orm";

export default defineEventHandler(async () => {
  const rows = await useDb().select().from(schema.media).orderBy(desc(schema.media.id));
  return rows.map((row) => ({ ...toMediaView(row), originalName: row.originalName, size: row.size, createdAt: row.createdAt }));
});
