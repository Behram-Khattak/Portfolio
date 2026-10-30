// Loads the site-wide details once. They end up in the pre-rendered page's state, so
// visitors never trigger this request. The dashboard doesn't use them.
export default defineNuxtPlugin(async () => {
  const site = useState<SiteData | null>("site", () => null);
  if (!site.value && !useRoute().path.startsWith("/admin")) site.value = await useRequestFetch()<SiteData>("/api/site");
});
