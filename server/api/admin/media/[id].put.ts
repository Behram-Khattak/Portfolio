import { eq } from "drizzle-orm";
import { mediaUpdateSchema } from "#shared/utils/schemas";

export default defineEventHandler(async (event) => {
  const id = parseId(getRouterParam(event, "id"));
  const { alt } = await readValidatedBody(event, mediaUpdateSchema.parse);
  await useDb().update(schema.media).set({ alt }).where(eq(schema.media.id, id));
  return { id };
});
