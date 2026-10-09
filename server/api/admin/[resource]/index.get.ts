export default defineEventHandler(async (event) => {
  const resource = getResource(getRouterParam(event, "resource"));
  return useDb().select().from(resource.table).orderBy(...resource.orderBy);
});
