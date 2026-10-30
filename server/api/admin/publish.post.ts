// Public pages are pre-rendered, so edits go live when the site is rebuilt.
export default defineEventHandler(async (event) => {
  const { deployHookUrl } = useRuntimeConfig(event);
  if (!deployHookUrl) throw createError({ statusCode: 503, statusMessage: "The deploy hook is not configured" });

  await $fetch(deployHookUrl, { method: "POST" });
  await audit(event, { action: "publish", entity: "site" });
  return { ok: true };
});
