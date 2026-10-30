// Sends the admin to GitHub to sign in. The random state ties the reply to this browser.
export default defineEventHandler((event) => {
  const { githubClientId } = useRuntimeConfig(event);
  if (!githubClientId) throw createError({ statusCode: 503, statusMessage: "Sign-in is not configured" });

  const state = crypto.randomUUID();
  setCookie(event, "oauth_state", state, { httpOnly: true, secure: true, sameSite: "lax", path: "/auth/github", maxAge: 600 });

  const url = new URL("https://github.com/login/oauth/authorize");
  url.search = new URLSearchParams({
    client_id: githubClientId,
    redirect_uri: `${getRequestURL(event).origin}/auth/github/callback`,
    state,
    allow_signup: "false",
  }).toString();
  return sendRedirect(event, url.toString());
});
