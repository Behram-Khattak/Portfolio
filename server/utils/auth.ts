import { eq } from "drizzle-orm";
import type { H3Event } from "h3";

declare module "#auth-utils" {
  interface User {
    id: number;
    email: string;
    // users.session_version at login time
    v: number;
  }
}

export function clientIp(event: H3Event) {
  // Only trust X-Forwarded-For when explicitly deployed behind a reverse proxy
  const trustProxy = process.env.TRUST_PROXY === "true";
  return getRequestIP(event, { xForwardedFor: trustProxy }) ?? "unknown";
}

// Resolves the logged-in admin, rejecting sessions issued before the last password change.
export async function requireAdmin(event: H3Event) {
  const session = await requireUserSession(event);
  const { users } = schema;
  const [user] = await useDb().select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user || user.sessionVersion !== session.user.v) {
    await clearUserSession(event);
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  return user;
}

export async function audit(
  event: H3Event,
  entry: { action: string; entity?: string; entityId?: string | number; detail?: string; userId?: number | null },
) {
  await useDb()
    .insert(schema.auditLogs)
    .values({
      userId: entry.userId ?? event.context.admin?.id ?? null,
      action: entry.action,
      entity: entry.entity ?? "",
      entityId: String(entry.entityId ?? ""),
      detail: (entry.detail ?? "").slice(0, 255),
      ip: clientIp(event),
    });
}
