// Convenience redirect only. The real access control is server/middleware/02.admin.ts.
export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, fetch } = useUserSession();
  if (!loggedIn.value) await fetch();
  if (!loggedIn.value) return navigateTo("/admin/login");
});
