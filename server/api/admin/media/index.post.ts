import { fileTypeFromBuffer } from "file-type";

const MAX_BYTES = 5 * 1024 * 1024;
// Raster formats only. SVG is excluded because it can carry scripts.
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event);
  const file = parts?.find((part) => part.name === "file");
  if (!file?.data?.length) throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  if (file.data.length > MAX_BYTES) throw createError({ statusCode: 413, statusMessage: "Images must be 5 MB or smaller" });

  // Trust the file's magic bytes, never its name or the Content-Type the client sent
  const detected = await fileTypeFromBuffer(file.data);
  if (!detected || !ALLOWED.has(detected.mime)) {
    throw createError({ statusCode: 415, statusMessage: "Only JPEG, PNG, WebP or AVIF images are allowed" });
  }

  let stored: Awaited<ReturnType<typeof storeImage>>;
  try {
    stored = await storeImage(file.data);
  } catch {
    throw createError({ statusCode: 415, statusMessage: "That file could not be read as an image" });
  }

  const originalName = (file.filename ?? "image").replace(/[^\w.\- ]/g, "").slice(0, 255) || "image";
  const [result] = await useDb().insert(schema.media).values({
    ...stored,
    originalName,
    alt: "",
  });
  await audit(event, { action: "upload", entity: "media", entityId: result.insertId, detail: originalName });
  return { id: result.insertId };
});
