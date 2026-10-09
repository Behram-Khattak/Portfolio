import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";

// AES-256-GCM for secrets stored at rest (TOTP seeds). The key is derived from the
// session password, so a database dump alone is not enough to generate login codes.
function key() {
  const secret = process.env.NUXT_SESSION_PASSWORD;
  if (!secret) throw new Error("NUXT_SESSION_PASSWORD is not set");
  return Buffer.from(hkdfSync("sha256", secret, "portfolio", "totp-secret", 32));
}

export function encryptValue(plain: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString("base64")).join(".");
}

export function decryptValue(value: string) {
  const [iv, tag, data] = value.split(".").map((p) => Buffer.from(p, "base64"));
  if (!iv || !tag || !data) throw new Error("Malformed encrypted value");
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
