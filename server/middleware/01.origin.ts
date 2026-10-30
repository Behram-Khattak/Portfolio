// CSRF defence in depth (on top of SameSite cookies): state-changing API requests
// must come from this site's own origin.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export default defineEventHandler((event) => {
  if (SAFE_METHODS.has(event.method) || !event.path.startsWith("/api/")) return;

  const allowedHosts = new Set([getRequestHost(event)]);
  try {
    allowedHosts.add(new URL(useRuntimeConfig(event).public.siteUrl).host);
  } catch {
    // siteUrl not configured; fall back to the Host header only
  }

  const origin = getHeader(event, "origin");
  const fetchSite = getHeader(event, "sec-fetch-site");
  let allowed = false;
  if (origin) {
    try {
      allowed = allowedHosts.has(new URL(origin).host);
    } catch {
      allowed = false;
    }
  } else if (fetchSite) {
    allowed = fetchSite === "same-origin";
  }

  if (!allowed) throw createError({ statusCode: 403, statusMessage: "Cross-origin request blocked" });
});
