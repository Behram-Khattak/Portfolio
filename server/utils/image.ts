import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";

// Kept free of Nitro imports so the seed script can use it too.

// Uploads live outside the web root and are only reachable through /media/[name]
export function uploadDir() {
  return resolve(process.cwd(), process.env.UPLOAD_DIR || "storage/uploads");
}

// Re-encodes an image to WebP (full size + thumbnail) and writes both to the upload dir.
// Re-encoding drops EXIF/GPS metadata and anything appended to the original file.
export async function storeImage(data: Buffer) {
  const source = sharp(data, { limitInputPixels: 50_000_000 }).rotate();
  const full = await source
    .clone()
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84 })
    .toBuffer({ resolveWithObject: true });
  const thumb = await source
    .clone()
    .resize({ width: 640, height: 640, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer();

  const id = randomUUID();
  const dir = uploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${id}.webp`), full.data, { mode: 0o640 });
  await writeFile(join(dir, `${id}-sm.webp`), thumb, { mode: 0o640 });
  return { filename: `${id}.webp`, width: full.info.width, height: full.info.height, size: full.data.length };
}
