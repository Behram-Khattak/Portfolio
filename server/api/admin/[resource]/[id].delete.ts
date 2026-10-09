import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "resource")!;
  const resource = getResource(name);
  const id = parseId(getRouterParam(event, "id"));

  const db = useDb();
  const [existing] = await db.select().from(resource.table).where(eq(resource.table.id, id)).limit(1);
  if (!existing) throw createError({ statusCode: 404, statusMessage: "Not found" });

  await db.delete(resource.table).where(eq(resource.table.id, id));
  await audit(event, { action: "delete", entity: name, entityId: id, detail: String((existing as Record<string, unknown>)[resource.label] ?? "") });
  return { ok: true };
});
