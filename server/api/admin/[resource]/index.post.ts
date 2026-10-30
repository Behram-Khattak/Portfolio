export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "resource")!;
  const resource = getResource(name);
  const data = await readValidatedBody(event, resource.schema.parse);
  const values = resource.prepare ? resource.prepare(data) : data;

  try {
    const [row] = await useDb().insert(resource.table).values(values as never).returning({ id: resource.table.id });
    await audit(event, { action: "create", entity: name, entityId: row?.id as number, detail: String(data[resource.label] ?? "") });
    return { id: row?.id };
  } catch (error) {
    rethrowDbError(error);
  }
});
