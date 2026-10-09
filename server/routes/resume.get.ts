import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join } from "node:path";

export default defineEventHandler(async (event) => {
  const resume = await getResume();
  const path = resume && join(uploadDir(), resume.file);
  const info = path ? await stat(path).catch(() => null) : null;
  if (!resume || !path || !info?.isFile()) throw createError({ statusCode: 404, statusMessage: "Not found" });

  setResponseHeaders(event, {
    "Content-Type": "application/pdf",
    "Content-Length": String(info.size),
    "Content-Disposition": `attachment; filename="${resume.name.replace(/"/g, "")}"`,
    "Cache-Control": "no-cache",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  });
  return sendStream(event, createReadStream(path));
});
