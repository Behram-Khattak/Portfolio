import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const resource = getResource(getRouterParam(event, "resource"));
  const id = parseId(getRouterParam(event, "id"));
  const [row] = await useDb().select().from(resource.table).where(eq(resource.table.id, id)).limit(1);
  if (!row) throw createError({ statusCode: 404, statusMessage: "Not found" });
  return row;
});
