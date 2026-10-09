import tailwindcss from "@tailwindcss/vite";

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000";
const isHttps = siteUrl.startsWith("https://");

export default defineNuxtConfig({
  compatibilityDate: "2026-01-01",
  devtools: { enabled: true },

  modules: [
    "nuxt-security",
    "nuxt-auth-utils",
    "@nuxt/fonts",
    "@nuxt/icon",
  ],

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
    // Icons are bundled and rendered as CSS/SVG from our own origin (no third-party API calls)
    serverBundle: "local",
    clientBundle: { scan: true, sizeLimitKb: 512 },
    fallbackToApi: false,
  },

  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || "",
      // 8 hours
      maxAge: 60 * 60 * 8,
      cookie: { httpOnly: true, sameSite: "lax", secure: isHttps },
    },
    public: { siteUrl },
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        "default-src": ["'self'"],
        "base-uri": ["'none'"],
        "connect-src": ["'self'"],
        "font-src": ["'self'", "data:"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'none'"],
        "frame-src": ["'none'"],
        "img-src": ["'self'", "data:", "blob:"],
        "object-src": ["'none'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "script-src": ["'self'", "'strict-dynamic'", "'nonce-{{nonce}}'"],
        "upgrade-insecure-requests": isHttps,
      },
      crossOriginEmbedderPolicy: "unsafe-none",
      xFrameOptions: "DENY",
      referrerPolicy: "strict-origin-when-cross-origin",
      strictTransportSecurity: { maxAge: 31536000, includeSubdomains: true },
      permissionsPolicy: {
        camera: [],
        "display-capture": [],
        geolocation: [],
        microphone: [],
        payment: [],
        usb: [],
      },
    },
    rateLimiter: { tokensPerInterval: 600, interval: 300000, headers: true },
    requestSizeLimiter: {
      maxRequestSizeInBytes: 1000000,
      maxUploadFileRequestInBytes: 6000000,
    },
    // Blog posts legitimately contain code samples with HTML; input is validated with zod
    // and escaped on output instead of being rejected by pattern matching.
    xssValidator: false,
  },

  routeRules: {
    "/admin/**": { ssr: false, headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/api/admin/**": { headers: { "Cache-Control": "no-store" } },
    "/api/auth/login": {
      security: { rateLimiter: { tokensPerInterval: 10, interval: 300000 } },
    },
    "/api/contact": {
      security: { rateLimiter: { tokensPerInterval: 5, interval: 600000 } },
    },
  },

  typescript: { strict: true },
});
