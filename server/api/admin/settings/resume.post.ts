const MAX_BYTES = 5 * 1024 * 1024;

export default defineEventHandler(async (event) => {
  const file = (await toWebRequest(event).formData()).get("file");
  if (!(file instanceof File) || !file.size) throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  if (file.size > MAX_BYTES) throw createError({ statusCode: 413, statusMessage: "The PDF must be 5 MB or smaller" });

  const bytes = await file.arrayBuffer();
  if (!isPdf(new Uint8Array(bytes.slice(0, 8)))) throw createError({ statusCode: 415, statusMessage: "Only PDF files are allowed" });

  const previous = await getResume();
  const stored = `resume-${crypto.randomUUID()}.pdf`;
  const bucket = useBucket();
  await bucket.put(stored, bytes, { httpMetadata: { contentType: "application/pdf" } });

  const name = file.name.replace(/[^\w.\- ]/g, "").slice(0, 120) || "resume.pdf";
  const value = { file: stored, name };
  await useDb().insert(schema.settings).values({ key: "resume", value }).onConflictDoUpdate({ target: schema.settings.key, set: { value } });
  if (previous) await bucket.delete(previous.file);
  await audit(event, { action: "upload", entity: "resume", detail: name });
  return { name };
});
