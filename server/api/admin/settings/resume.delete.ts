import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const resume = await getResume();
  if (resume) {
    await useDb().delete(schema.settings).where(eq(schema.settings.key, "resume"));
    await useBucket().delete(resume.file);
    await audit(event, { action: "delete", entity: "resume", detail: resume.name });
  }
  return { ok: true };
});
