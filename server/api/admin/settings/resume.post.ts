import { fileTypeFromBuffer } from "file-type";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const MAX_BYTES = 5 * 1024 * 1024;

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event);
  const file = parts?.find((part) => part.name === "file");
  if (!file?.data?.length) throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  if (file.data.length > MAX_BYTES) throw createError({ statusCode: 413, statusMessage: "The PDF must be 5 MB or smaller" });
  const detected = await fileTypeFromBuffer(file.data);
  if (detected?.mime !== "application/pdf") throw createError({ statusCode: 415, statusMessage: "Only PDF files are allowed" });

  const previous = await getResume();
  const stored = `resume-${randomUUID()}.pdf`;
  const dir = uploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, stored), file.data, { mode: 0o640 });

  const name = (file.filename ?? "resume.pdf").replace(/[^\w.\- ]/g, "").slice(0, 120) || "resume.pdf";
  const value = { file: stored, name };
  await useDb().insert(schema.settings).values({ key: "resume", value }).onDuplicateKeyUpdate({ set: { value } });
  if (previous) await rm(join(dir, previous.file), { force: true });
  await audit(event, { action: "upload", entity: "resume", detail: name });
  return { name };
});
