import { eq } from "drizzle-orm";
import { rm } from "node:fs/promises";
import { join } from "node:path";

export default defineEventHandler(async (event) => {
  const resume = await getResume();
  if (resume) {
    await useDb().delete(schema.settings).where(eq(schema.settings.key, "resume"));
    await rm(join(uploadDir(), resume.file), { force: true });
    await audit(event, { action: "delete", entity: "resume", detail: resume.name });
  }
  return { ok: true };
});
