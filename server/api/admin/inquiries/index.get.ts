import { desc } from "drizzle-orm";

export default defineEventHandler(() =>
  useDb().select().from(schema.inquiries).orderBy(desc(schema.inquiries.createdAt)).limit(500),
);
