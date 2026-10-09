import { inArray } from "drizzle-orm";

export type MediaView = {
  id: number;
  url: string;
  thumb: string;
  alt: string;
  width: number;
  height: number;
};

export const MEDIA_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(-sm)?\.webp$/;

export function toMediaView(m: typeof schema.media.$inferSelect): MediaView {
  return {
    id: m.id,
    url: `/media/${m.filename}`,
    thumb: `/media/${m.filename.replace(".webp", "-sm.webp")}`,
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
