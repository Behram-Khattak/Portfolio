import { createRemoteJWKSet, jwtVerify } from "jose";
import type { H3Event } from "h3";

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

// Cloudflare Access signs in the admin before a request reaches the Worker. Its token is still
// verified here, so a request that arrives any other way (workers.dev, say) gets nowhere.
export async function requireAdmin(event: H3Event) {
  if (import.meta.dev) return { email: "dev@localhost" };

  const { accessTeamDomain, accessAud } = useRuntimeConfig(event);
  if (!accessTeamDomain || !accessAud) throw createError({ statusCode: 503, statusMessage: "Sign-in is not configured" });

  const token = getHeader(event, "cf-access-jwt-assertion");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const issuer = accessTeamDomain.replace(/\/$/, "");
  jwks ??= createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
  try {
    const { payload } = await jwtVerify(token, jwks, { issuer, audience: accessAud, algorithms: ["RS256"] });
    return { email: String(payload.email ?? "") };
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
}

export async function audit(event: H3Event, entry: { action: string; entity?: string; entityId?: string | number; detail?: string }) {
  await useDb()
    .insert(schema.auditLogs)
    .values({
      actor: event.context.admin?.email ?? "",
      action: entry.action,
      entity: entry.entity ?? "",
      entityId: String(entry.entityId ?? ""),
      detail: (entry.detail ?? "").slice(0, 255),
      ip: getHeader(event, "cf-connecting-ip") ?? "",
    });
}
