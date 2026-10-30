import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = parseId(getRouterParam(event, "id"));
  await useDb().delete(schema.inquiries).where(eq(schema.inquiries.id, id));
  await audit(event, { action: "delete", entity: "inquiries", entityId: id });
  return { ok: true };
});
