// Site-wide details (name, contact, socials), loaded by app/plugins/site.ts.
export function useSite() {
  return useState<SiteData>("site");
}
