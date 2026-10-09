declare module "h3" {
  interface H3EventContext {
    admin?: typeof schema.users.$inferSelect;
  }
}

// Every /api/admin/** route requires a valid admin session; nothing below has to opt in.
export default defineEventHandler(async (event) => {
  if (!event.path.startsWith("/api/admin/") && event.path !== "/api/admin") return;
  event.context.admin = await requireAdmin(event);
});
