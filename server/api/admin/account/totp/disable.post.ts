import { eq } from "drizzle-orm";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const admin = event.context.admin!;
  const { password } = await readValidatedBody(event, z.object({ password: z.string().min(1).max(200) }).parse);
  if (!(await verifySecret(admin.passwordHash, password))) {
    throw createError({ statusCode: 400, statusMessage: "Password is incorrect" });
  }
  await useDb().update(schema.users).set({ totpEnabled: false, totpSecret: null }).where(eq(schema.users.id, admin.id));
  await audit(event, { action: "2fa_disabled", entity: "user", entityId: admin.id });
  return { ok: true };
});
