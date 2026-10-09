import tailwindcss from "@tailwindcss/vite";

// Static site: `nuxt generate` pre-renders every page to .output/public for GitHub Pages.
export default defineNuxtConfig({
  compatibilityDate: "2026-01-01",
  devtools: { enabled: true },

  modules: ["@nuxt/fonts", "@nuxt/icon"],

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
    // There is no server at runtime, so every icon must ship in the JavaScript bundle.
    // The scan covers the data files too, where service and skill icons are named.
    provider: "none",
    clientBundle: { scan: { globInclude: ["app/**/*.{vue,ts}"], globExclude: ["node_modules", ".nuxt", ".output"] }, sizeLimitKb: 512 },
    fallbackToApi: false,
  },

  runtimeConfig: {
    public: { siteUrl: "https://behramkttk.dev" },
  },

  nitro: {
    prerender: { crawlLinks: true, routes: ["/"] },
  },

  typescript: { strict: true },
});
