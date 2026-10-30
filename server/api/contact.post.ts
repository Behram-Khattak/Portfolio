import type { H3Event } from "h3";
import { contactSchema } from "#shared/utils/schemas";

const MIN_FILL_MS = 3000;

async function passesTurnstile(event: H3Event, token: string, ip: string) {
  const { turnstileSecretKey: secret } = useRuntimeConfig(event);
  if (!secret) throw createError({ statusCode: 503, statusMessage: "Contact form is not configured" });

  const result = await $fetch<{ success: boolean }>("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: { secret, response: token, remoteip: ip },
  });
  return result.success;
}

export default defineEventHandler(async (event) => {
  const { website, startedAt, turnstileToken, ...inquiry } = await readValidatedBody(event, contactSchema.parse);
  const ip = getHeader(event, "cf-connecting-ip") ?? "";

  if (!(await passesTurnstile(event, turnstileToken, ip))) {
    throw createError({ statusCode: 403, statusMessage: "Spam check failed" });
  }

  // Bots that fill the hidden field or submit instantly get a normal-looking response
  // so they have nothing to adapt to, but nothing is stored.
  const looksAutomated = website !== "" || Date.now() - startedAt < MIN_FILL_MS;
  if (!looksAutomated) {
    await useDb().insert(schema.inquiries).values({ ...inquiry, ip });
  }
  return { ok: true };
});
