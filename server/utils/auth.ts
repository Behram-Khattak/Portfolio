import { jwtVerify, SignJWT } from "jose";
import type { H3Event } from "h3";

const SESSION_COOKIE = "__Host-admin_session";
const SESSION_HOURS = 8;

function sessionKey(event: H3Event) {
  const { sessionSecret } = useRuntimeConfig(event);
  if (sessionSecret.length < 32) throw createError({ statusCode: 503, statusMessage: "Sign-in is not configured" });
  return new TextEncoder().encode(sessionSecret);
}

export async function startSession(event: H3Event, user: { id: number; login: string }) {
  const token = await new SignJWT({ login: user.login })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(sessionKey(event));
  setCookie(event, SESSION_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: SESSION_HOURS * 3600 });
}

export function endSession(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
}

// The session cookie is signed by the Worker, and only the one allowed GitHub account can get one.
export async function requireAdmin(event: H3Event) {
  if (import.meta.dev) return { login: "dev" };

  const key = sessionKey(event);
  const unauthorized = createError({ statusCode: 401, statusMessage: "Your session expired. Open the dashboard in a new tab to sign in, then try again." });
  const token = getCookie(event, SESSION_COOKIE);
  if (!token) throw unauthorized;

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (payload.sub !== String(useRuntimeConfig(event).adminGithubId)) throw unauthorized;
    return { login: String(payload.login ?? "") };
  } catch {
    throw unauthorized;
  }
}

export async function audit(event: H3Event, entry: { action: string; entity?: string; entityId?: string | number; detail?: string }) {
  await useDb()
    .insert(schema.auditLogs)
    .values({
      actor: event.context.admin?.login ?? "",
      action: entry.action,
      entity: entry.entity ?? "",
      entityId: String(entry.entityId ?? ""),
      detail: (entry.detail ?? "").slice(0, 255),
      ip: getHeader(event, "cf-connecting-ip") ?? "",
    });
}
