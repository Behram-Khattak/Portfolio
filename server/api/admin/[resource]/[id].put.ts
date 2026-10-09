import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "resource")!;
  const resource = getResource(name);
  const id = parseId(getRouterParam(event, "id"));
  const data = await readValidatedBody(event, resource.schema.parse);

  const db = useDb();
  const [existing] = await db.select().from(resource.table).where(eq(resource.table.id, id)).limit(1);
  if (!existing) throw createError({ statusCode: 404, statusMessage: "Not found" });
  const values = resource.prepare ? resource.prepare(data, existing) : data;

  try {
    await db.update(resource.table).set(values).where(eq(resource.table.id, id));
  } catch (error) {
    rethrowDbError(error);
  }
  await audit(event, { action: "update", entity: name, entityId: id, detail: String(data[resource.label] ?? "") });
  return { id };
});
