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

export function mediaUrl(key: string) {
  return `${useRuntimeConfig().public.mediaUrl}/${key}`;
}

export function toMediaView(m: typeof schema.media.$inferSelect): MediaView {
  return {
    id: m.id,
    url: mediaUrl(m.filename),
    // Seeded images were never resized, so they have no thumbnail
    thumb: UPLOAD_NAME.test(m.filename) ? mediaUrl(m.filename.replace(/\.(webp|jpg)$/, "-sm.$1")) : mediaUrl(m.filename),
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
