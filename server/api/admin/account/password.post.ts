import { eq } from "drizzle-orm";
import { passwordChangeSchema } from "#shared/utils/schemas";

export default defineEventHandler(async (event) => {
  const admin = event.context.admin!;
  const { current, next } = await readValidatedBody(event, passwordChangeSchema.parse);
  if (!(await verifySecret(admin.passwordHash, current))) {
    await audit(event, { action: "password_change_failed", entity: "user", entityId: admin.id });
    throw createError({ statusCode: 400, statusMessage: "Current password is incorrect" });
  }

  // Bumping sessionVersion signs out every other session
  const sessionVersion = admin.sessionVersion + 1;
  await useDb()
    .update(schema.users)
    .set({ passwordHash: await hashSecret(next), sessionVersion })
    .where(eq(schema.users.id, admin.id));
  await replaceUserSession(event, { user: { id: admin.id, email: admin.email, v: sessionVersion }, loggedInAt: Date.now() });
  await audit(event, { action: "password_changed", entity: "user", entityId: admin.id });
  return { ok: true };
});
