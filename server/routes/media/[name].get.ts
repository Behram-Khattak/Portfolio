import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join } from "node:path";

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "name") ?? "";
  // Only names we generate ourselves are served, which rules out path traversal entirely
  if (!MEDIA_NAME.test(name)) throw createError({ statusCode: 404, statusMessage: "Not found" });

  const path = join(uploadDir(), name);
  const info = await stat(path).catch(() => null);
  if (!info?.isFile()) throw createError({ statusCode: 404, statusMessage: "Not found" });

  setResponseHeaders(event, {
    "Content-Type": "image/webp",
    "Content-Length": String(info.size),
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  });
  return sendStream(event, createReadStream(path));
});
