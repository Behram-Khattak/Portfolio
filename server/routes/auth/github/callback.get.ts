export default defineEventHandler(async (event) => {
  const { code, state } = getQuery(event);
  const expected = getCookie(event, "oauth_state");
  deleteCookie(event, "oauth_state", { path: "/auth/github" });
  if (typeof code !== "string" || !expected || state !== expected) {
    throw createError({ statusCode: 400, statusMessage: "Sign-in failed. Go back to /admin and try again." });
  }

  const { githubClientId, githubClientSecret, adminGithubId } = useRuntimeConfig(event);
  const { access_token: accessToken } = await $fetch<{ access_token?: string }>("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: { client_id: githubClientId, client_secret: githubClientSecret, code },
  });
  if (!accessToken) throw createError({ statusCode: 400, statusMessage: "Sign-in failed. Go back to /admin and try again." });

  const user = await $fetch<{ id: number; login: string }>("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}`, "User-Agent": "portfolio-admin" },
  });
  // The numeric id, because a GitHub username can be changed and then claimed by someone else
  if (String(user.id) !== String(adminGithubId)) {
    throw createError({ statusCode: 403, statusMessage: "This GitHub account is not allowed to use the dashboard." });
  }

  await startSession(event, user);
  event.context.admin = { login: user.login };
  await audit(event, { action: "login", entity: "session" });
  return sendRedirect(event, "/admin");
});
