const MAX_BYTES = 5 * 1024 * 1024;

export default defineEventHandler(async (event) => {
  // The platform's own parser: parsing in JavaScript would eat the Worker's CPU allowance
  const form = await toWebRequest(event).formData();
  const file = form.get("file");
  const thumb = form.get("thumb");
  const width = Number(form.get("width"));
  const height = Number(form.get("height"));
  if (!(file instanceof File) || !(thumb instanceof File) || !width || !height) {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  }
  if (file.size > MAX_BYTES || thumb.size > MAX_BYTES) throw createError({ statusCode: 413, statusMessage: "Images must be 5 MB or smaller" });

  const [image, small] = await Promise.all([file.arrayBuffer(), thumb.arrayBuffer()]);
  const format = sniffImage(new Uint8Array(image.slice(0, 16)));
  if (!format || sniffImage(new Uint8Array(small.slice(0, 16)))?.ext !== format.ext) {
    throw createError({ statusCode: 415, statusMessage: "Only WebP or JPEG images are allowed" });
  }

  const filename = `${crypto.randomUUID()}.${format.ext}`;
  const httpMetadata = { contentType: format.type, cacheControl: "public, max-age=31536000, immutable" };
  const bucket = useBucket();
  await Promise.all([bucket.put(filename, image, { httpMetadata }), bucket.put(thumbKey(filename), small, { httpMetadata })]);

  const originalName = file.name.replace(/[^\w.\- ]/g, "").slice(0, 255) || "image";
  const [row] = await useDb()
    .insert(schema.media)
    .values({ filename, originalName, alt: "", width, height, size: file.size })
    .returning({ id: schema.media.id });
  await audit(event, { action: "upload", entity: "media", entityId: row?.id, detail: originalName });
  return { id: row?.id };
});
