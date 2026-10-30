declare module "h3" {
  interface H3EventContext {
    admin?: { email: string };
  }
}

// Every /api/admin/** route requires a valid Cloudflare Access token; nothing below has to opt in.
export default defineEventHandler(async (event) => {
  if (!event.path.startsWith("/api/admin/") && event.path !== "/api/admin") return;
  event.context.admin = await requireAdmin(event);
});
