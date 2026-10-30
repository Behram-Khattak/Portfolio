export type ProjectImage = { url: string; alt: string; width: number; height: number };

// A project as shown on a tile. `service` is the slug of its service, if any.
export type ProjectCard = {
  slug: string;
  title: string;
  summary: string;
  client: string;
  year: string;
  tech: string[];
  service: string | null;
  featured: boolean;
  cover: ProjectImage | null;
};

export type SiteData = {
  site: { name: string; role: string; description: string };
  contact: { email: string; phone: string; whatsapp: string; location: string; availability: string };
  socials: { github: string; linkedin: string; youtube: string; x: string };
  resumeUrl: string;
};
