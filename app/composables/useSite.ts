import { site } from "~/data/site";

// Site-wide details (name, contact, socials) in the shape the layout and pages expect.
// The content itself lives in app/data/site.ts.
export function useSite() {
  return ref({
    site: { name: site.name, role: site.role, description: site.description },
    contact: site.contact,
    socials: site.socials,
    resumeUrl: site.resumeUrl,
  });
}
