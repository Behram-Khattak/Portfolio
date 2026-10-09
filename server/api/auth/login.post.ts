import { and, count, eq, gt } from "drizzle-orm";
import { verify } from "otplib";
import { loginSchema } from "#shared/utils/schemas";

const WINDOW_MS = 15 * 60 * 1000;
// Per-IP is the main brake. The per-account cap is deliberately loose: the admin email is
// public, so a tight one would let anyone lock the owner out, while 50 guesses per
// 15 minutes is still useless against a strong password.
const MAX_FAILS_PER_IP = 10;
const MAX_FAILS_PER_EMAIL = 50;

// Verified when the email is unknown so response time does not reveal which accounts exist
let dummyHash: Promise<string> | undefined;

export default defineEventHandler(async (event) => {
  const { email, password, code } = await readValidatedBody(event, loginSchema.parse);
  const normalizedEmail = email.toLowerCase();
  const ip = clientIp(event);
  const db = useDb();
  const { loginAttempts, users } = schema;

  const since = new Date(Date.now() - WINDOW_MS);
  const failures = (column: typeof loginAttempts.ip | typeof loginAttempts.email, value: string) =>
    db
      .select({ total: count() })
      .from(loginAttempts)
      .where(and(eq(column, value), eq(loginAttempts.success, false), gt(loginAttempts.createdAt, since)))
      .then((rows) => rows[0]?.total ?? 0);

  const [ipFails, emailFails] = await Promise.all([
    failures(loginAttempts.ip, ip),
    failures(loginAttempts.email, normalizedEmail),
  ]);
  if (ipFails >= MAX_FAILS_PER_IP || emailFails >= MAX_FAILS_PER_EMAIL) {
    throw createError({ statusCode: 429, statusMessage: "Too many attempts. Try again in 15 minutes." });
  }

  const fail = async (detail: string) => {
    await db.insert(loginAttempts).values({ email: normalizedEmail, ip, success: false });
    await audit(event, { action: "login_failed", entity: "user", detail, userId: null });
    throw createError({ statusCode: 401, statusMessage: "Invalid email or password" });
  };

  const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
  const hash = user?.passwordHash ?? (await (dummyHash ??= hashSecret("not-a-real-password")));
  const passwordOk = await verifySecret(hash, password);
  if (!user || !passwordOk) return fail("bad credentials");

  if (user.totpEnabled && user.totpSecret) {
    if (!code) {
      throw createError({ statusCode: 401, statusMessage: "Authentication code required", data: { totpRequired: true } });
    }
    const result = await verify({ secret: decryptValue(user.totpSecret), token: code, epochTolerance: 30 });
    if (!result.valid) return fail("bad 2FA code");
  }

  await db.insert(loginAttempts).values({ email: normalizedEmail, ip, success: true });
  // replaceUserSession issues a fresh sealed cookie, discarding any pre-login session data
  await replaceUserSession(event, { user: { id: user.id, email: user.email, v: user.sessionVersion }, loggedInAt: Date.now() });
  await audit(event, { action: "login", entity: "user", entityId: user.id, userId: user.id });
  return { ok: true };
});
