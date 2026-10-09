export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "resource")!;
  const resource = getResource(name);
  const data = await readValidatedBody(event, resource.schema.parse);
  const values = resource.prepare ? resource.prepare(data) : data;

  try {
    const [result] = await useDb().insert(resource.table).values(values);
    await audit(event, { action: "create", entity: name, entityId: result.insertId, detail: String(data[resource.label] ?? "") });
    return { id: result.insertId };
  } catch (error) {
    rethrowDbError(error);
  }
});
