const MAX_SIZE = 2000;
const THUMB_SIZE = 640;

// Workers can't run an image library, so uploads are resized here. Redrawing to a canvas also
// drops EXIF data such as GPS location. Safari can't encode WebP, so it gets JPEG instead.
async function encode(bitmap: ImageBitmap, maxSize: number, type: string, quality: number) {
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d")!;
  if (type === "image/jpeg") {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  return blob?.type === type ? { blob, width: canvas.width, height: canvas.height } : null;
}

export async function prepareImage(file: File) {
  const bitmap = await createImageBitmap(file);
  try {
    const main = (await encode(bitmap, MAX_SIZE, "image/webp", 0.84)) ?? (await encode(bitmap, MAX_SIZE, "image/jpeg", 0.84));
    if (!main) throw new Error("This browser could not process that image.");
    const thumb = await encode(bitmap, THUMB_SIZE, main.blob.type, 0.78);
    if (!thumb) throw new Error("This browser could not process that image.");

    const body = new FormData();
    body.append("file", main.blob, file.name);
    body.append("thumb", thumb.blob, file.name);
    body.append("width", String(main.width));
    body.append("height", String(main.height));
    return body;
  } finally {
    bitmap.close();
  }
}
