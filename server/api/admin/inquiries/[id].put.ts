import { eq } from "drizzle-orm";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const id = parseId(getRouterParam(event, "id"));
  const { isRead } = await readValidatedBody(event, z.object({ isRead: z.boolean() }).parse);
  await useDb().update(schema.inquiries).set({ isRead }).where(eq(schema.inquiries.id, id));
  return { id };
});
