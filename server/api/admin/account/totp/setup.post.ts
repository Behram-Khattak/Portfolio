import { eq } from "drizzle-orm";
import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";

// Starts 2FA enrolment: stores a pending secret that only takes effect once a code is confirmed.
export default defineEventHandler(async (event) => {
  const admin = event.context.admin!;
  if (admin.totpEnabled) throw createError({ statusCode: 400, statusMessage: "Two-factor authentication is already enabled" });

  const secret = generateSecret();
  await useDb().update(schema.users).set({ totpSecret: encryptValue(secret) }).where(eq(schema.users.id, admin.id));
  const uri = generateURI({ issuer: "Portfolio Admin", label: admin.email, secret });
  return { secret, qr: await QRCode.toDataURL(uri, { margin: 1, width: 220 }) };
});
