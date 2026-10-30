import { inArray } from "drizzle-orm";

export type MediaView = {
  id: number;
  url: string;
  thumb: string;
  alt: string;
  width: number;
  height: number;
};

// Uploads are named <uuid>.webp or <uuid>.jpg, with a <uuid>-sm thumbnail next to them
const UPLOAD_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(webp|jpg)$/;

type Bucket = {
  put: (key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }) => Promise<unknown>;
  delete: (keys: string | string[]) => Promise<void>;
};

export function useBucket() {
  const bucket = useEvent().context.cloudflare?.env?.portfolio_media as Bucket | undefined;
  if (!bucket) throw createError({ statusCode: 503, statusMessage: "File storage is not available" });
  return bucket;
}

export function thumbKey(key: string) {
  return key.replace(/\.(webp|jpg)$/, "-sm.$1");
}

// The dashboard resizes images in the browser, so this only checks what actually arrived.
// Magic bytes are trusted, never the file's name or the Content-Type the client sent.
export function sniffImage(bytes: Uint8Array) {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { ext: "webp", type: "image/webp" };
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  return null;
}

export function isPdf(bytes: Uint8Array) {
  return String.fromCharCode(...bytes.subarray(0, 5)) === "%PDF-";
}

export function mediaUrl(key: string) {
  return `${useRuntimeConfig().public.mediaUrl}/${key}`;
}

export function toMediaView(m: typeof schema.media.$inferSelect): MediaView {
  return {
    id: m.id,
    url: mediaUrl(m.filename),
    // Seeded images were never resized, so they have no thumbnail
    thumb: mediaUrl(UPLOAD_NAME.test(m.filename) ? thumbKey(m.filename) : m.filename),
    alt: m.alt,
    width: m.width,
    height: m.height,
  };
}

export async function loadMedia(ids: (number | null | undefined)[]) {
  const wanted = [...new Set(ids.filter((id): id is number => typeof id === "number"))];
  const map = new Map<number, MediaView>();
  if (!wanted.length) return map;
  const rows = await useDb().select().from(schema.media).where(inArray(schema.media.id, wanted));
  for (const row of rows) map.set(row.id, toMediaView(row));
  return map;
}
