import { eq } from "drizzle-orm";
import { verify } from "otplib";
import { totpCodeSchema } from "#shared/utils/schemas";

export default defineEventHandler(async (event) => {
  const admin = event.context.admin!;
  const { code } = await readValidatedBody(event, totpCodeSchema.parse);
  if (admin.totpEnabled || !admin.totpSecret) throw createError({ statusCode: 400, statusMessage: "Start setup first" });

  const result = await verify({ secret: decryptValue(admin.totpSecret), token: code, epochTolerance: 30 });
  if (!result.valid) throw createError({ statusCode: 400, statusMessage: "That code is not valid" });

  await useDb().update(schema.users).set({ totpEnabled: true }).where(eq(schema.users.id, admin.id));
  await audit(event, { action: "2fa_enabled", entity: "user", entityId: admin.id });
  return { ok: true };
});
