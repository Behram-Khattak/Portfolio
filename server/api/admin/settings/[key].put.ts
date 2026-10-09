import { settingsSchemas, type SettingsKey } from "#shared/utils/schemas";

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, "key") ?? "";
  if (!Object.hasOwn(settingsSchemas, key)) throw createError({ statusCode: 404, statusMessage: "Not found" });
  const value = await readValidatedBody(event, (body) => settingsSchemas[key as SettingsKey].parse(body));

  await useDb().insert(schema.settings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
  await audit(event, { action: "update", entity: "settings", entityId: key });
  return { ok: true };
});
