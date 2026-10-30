import tailwindcss from "@tailwindcss/vite";

// Service and skill icons are named in D1, where the source scan can't see them. Without this,
// an icon first used from the dashboard would render blank.
async function iconsInDatabase() {
  const { D1_ACCOUNT_ID, D1_DATABASE_ID, D1_API_TOKEN } = process.env;
  if (!D1_ACCOUNT_ID || !D1_DATABASE_ID || !D1_API_TOKEN) return [];

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${D1_ACCOUNT_ID}/d1/database/${D1_DATABASE_ID}/raw`, {
    method: "POST",
    headers: { Authorization: `Bearer ${D1_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ sql: "SELECT icon FROM services UNION SELECT icon FROM skills" }),
  });
  if (!response.ok) throw new Error(`Could not read icons from D1 (${response.status})`);
  const payload = (await response.json()) as { result: { results: { rows: string[][] } }[] };
  return payload.result[0]?.results.rows.map(([icon]) => icon!) ?? [];
}

// Cloudflare Worker: public pages are pre-rendered and served as static assets,
// and only the dashboard and API routes run in the Worker.
export default defineNuxtConfig({
  compatibilityDate: "2026-01-01",
  devtools: { enabled: true },

  modules: ["nitro-cloudflare-dev", "@nuxt/fonts", "@nuxt/icon"],

  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      link: [{ rel: "icon", href: "/favicon.ico" }],
    },
  },

  fonts: {
    families: [
      { name: "Bricolage Grotesque", provider: "google", weights: [400, 500, 600] },
      { name: "IBM Plex Sans", provider: "google", weights: [400, 500, 600] },
      { name: "IBM Plex Mono", provider: "google", weights: [400, 500] },
    ],
  },

  icon: {
    // Public pages make no server calls, so every icon must ship in the JavaScript bundle.
    // The scan covers the seed data so local builds without D1 access still have its icons.
    provider: "none",
    clientBundle: { scan: { globInclude: ["app/**/*.{vue,ts}", "scripts/seed-data/*.ts"], globExclude: ["node_modules", ".nuxt", ".output"] }, sizeLimitKb: 512 },
    fallbackToApi: false,
  },

  hooks: {
    async "icon:clientBundleIcons"(icons) {
      for (const icon of await iconsInDatabase()) icons.add(icon);
    },
  },

  runtimeConfig: {
    turnstileSecretKey: "",
    githubClientId: "",
    githubClientSecret: "",
    sessionSecret: "",
    // Public GitHub user id of the only account allowed into the dashboard
    adminGithubId: "81041662",
    deployHookUrl: "",
    public: { siteUrl: "https://behramkttk.dev", mediaUrl: "https://media.behramkttk.dev", turnstileSiteKey: "" },
  },

  routeRules: {
    "/**": {
      headers: {
        "Content-Security-Policy": [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https://media.behramkttk.dev https://api.iconify.design",
          "font-src 'self' data:",
          "connect-src 'self' https://cloudflareinsights.com",
          "frame-src https://challenges.cloudflare.com",
          "frame-ancestors 'none'",
          "form-action 'self'",
          "base-uri 'none'",
          "object-src 'none'",
        ].join("; "),
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    },
    // The dashboard is client-only; public pages are pre-rendered from D1 at build time.
    "/admin/**": { ssr: false, headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/api/admin/**": { headers: { "Cache-Control": "no-store" } },
  },

  nitro: {
    preset: "cloudflare_module",
    cloudflare: { deployConfig: true, nodeCompat: true },
    // Lets useDb() reach the D1 binding without passing the event around
    experimental: { asyncContext: true },
    // Emit /services.html rather than /services/index.html, so /services doesn't redirect
    prerender: { crawlLinks: true, routes: ["/", "/sitemap.xml"], autoSubfolderIndex: false, failOnError: true },
  },

  typescript: { strict: true },
});
