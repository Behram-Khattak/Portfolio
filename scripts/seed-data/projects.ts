// Projects, in display order.
// cover / gallery images live in public/images/ and are written as { url, alt, width, height }.
// `service` is the slug of a service in services.ts (or null); `body` is a list of paragraphs.
export type ProjectImage = { url: string; alt: string; width: number; height: number };
export type Project = {
  slug: string;
  title: string;
  summary: string;
  client: string;
  role: string;
  year: string;
  tech: string[];
  liveUrl: string;
  repoUrl: string;
  service: string | null;
  featured: boolean;
  cover: ProjectImage | null;
  gallery: ProjectImage[];
  body: string[];
};

export const projects: Project[] = [
  {
    "slug": "quotes-network",
    "title": "Quotes Network",
    "summary": "Join Us On Our Engaging Social Media Journey As We Curate And Share The Best Quotes Every Day. Connect With Us On Pinterest And Instagram To Enhance Your Personal Growth And Enrich Your Daily Life.",
    "client": "",
    "role": "",
    "year": "",
    "tech": [
      "Laravel",
      "Bootstrap",
      "JavaScript"
    ],
    "liveUrl": "https://quotes.network/",
    "repoUrl": "",
    "service": null,
    "featured": true,
    "cover": null,
    "gallery": [],
    "body": []
  },
  {
    "slug": "cogni-4-health",
    "title": "Cogni 4 Health",
    "summary": "Cogni® is expanding Wellness for All, Always Providing virtual solutions to accelerate wellness results so that Wellness Programs and Mental Health Providers support more people without delay.",
    "client": "",
    "role": "",
    "year": "",
    "tech": [
      "Laravel",
      "Bootstrap",
      "JavaScript"
    ],
    "liveUrl": "https://cogni4health.com/",
    "repoUrl": "",
    "service": null,
    "featured": true,
    "cover": null,
    "gallery": [],
    "body": []
  }
];
