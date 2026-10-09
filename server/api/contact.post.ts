import { contactSchema } from "#shared/utils/schemas";

const MIN_FILL_MS = 3000;

export default defineEventHandler(async (event) => {
  const { website, startedAt, ...inquiry } = await readValidatedBody(event, contactSchema.parse);

  // Bots that fill the hidden field or submit instantly get a normal-looking response
  // so they have nothing to adapt to, but nothing is stored.
  const looksAutomated = website !== "" || Date.now() - startedAt < MIN_FILL_MS;
  if (!looksAutomated) {
    await useDb().insert(schema.inquiries).values({ ...inquiry, ip: clientIp(event) });
  }
  return { ok: true };
});
