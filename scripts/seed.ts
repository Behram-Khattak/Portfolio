// Loads the content that used to live in app/data into D1 and R2.
//   node scripts/seed.ts --local    or    node scripts/seed.ts --remote
// Every insert is INSERT OR IGNORE, so re-running never overwrites edits made in the dashboard.
import { spawnSync } from "node:child_process";
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { experience } from "../app/data/experience.ts";
import { projects } from "../app/data/projects.ts";
import { services } from "../app/data/services.ts";
import { site } from "../app/data/site.ts";
import { skills } from "../app/data/skills.ts";

const target = process.argv[2];
if (target !== "--local" && target !== "--remote") {
  console.error("Usage: node scripts/seed.ts --local|--remote");
  process.exit(1);
}

const BUCKET = "portfolio-media";
const RESUME_FILE = "Behram_Khattak_Resume.pdf";

const quote = (value: unknown) => {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "number") return String(value);
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `'${text.replaceAll("'", "''")}'`;
};

const statements: string[] = [];
const insert = (table: string, row: Record<string, unknown>) => {
  const columns = Object.keys(row).join(", ");
  const values = Object.values(row).map(quote).join(", ");
  statements.push(`INSERT OR IGNORE INTO ${table} (${columns}) VALUES (${values});`);
};

const images = [site.about.profile, ...experience.map((job) => job.logo)];
images.forEach((image, index) => {
  const filename = basename(image.url);
  insert("media", {
    id: index + 1,
    filename,
    original_name: filename,
    alt: image.alt,
    width: image.width,
    height: image.height,
    size: statSync(join("public/images", filename)).size,
  });
});

services.forEach((service, index) =>
  insert("services", {
    id: index + 1,
    slug: service.slug,
    title: service.title,
    tagline: service.tagline,
    description: service.description,
    icon: service.icon,
    deliverables: service.deliverables,
    sort_order: index,
    published: true,
  }),
);

projects.forEach((project, index) =>
  insert("projects", {
    id: index + 1,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    body: project.body.join("\n\n"),
    client: project.client,
    role: project.role,
    year: project.year,
    tech: project.tech,
    live_url: project.liveUrl,
    repo_url: project.repoUrl,
    service_id: project.service ? services.findIndex((s) => s.slug === project.service) + 1 : null,
    gallery: [],
    featured: project.featured,
    published: true,
    sort_order: index,
  }),
);

experience.forEach((job, index) =>
  insert("experiences", {
    id: index + 1,
    company: job.company,
    role: job.role,
    timeline: job.timeline,
    summary: job.summary,
    link: job.link,
    logo_media_id: index + 2,
    sort_order: index,
  }),
);

skills.forEach((skill, index) =>
  insert("skills", { id: index + 1, name: skill.name, icon: skill.icon, category: skill.category, sort_order: index }),
);

const settings = {
  site: { name: site.name, role: site.role, description: site.description },
  contact: site.contact,
  socials: site.socials,
  hero: site.hero,
  about: { heading: site.about.heading, body: site.about.paragraphs.join("\n\n"), profileMediaId: 1 },
  resume: { file: RESUME_FILE, name: RESUME_FILE },
};
for (const [key, value] of Object.entries(settings)) insert("settings", { key, value });

mkdirSync(".wrangler", { recursive: true });
writeFileSync(".wrangler/seed.sql", statements.join("\n"));

const wrangler = (...args: string[]) => {
  const result = spawnSync("npx", ["wrangler", ...args, target], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

wrangler("d1", "execute", "portfolio", "--file", ".wrangler/seed.sql");

const upload = (key: string, file: string, type: string) =>
  wrangler("r2", "object", "put", `${BUCKET}/${key}`, "--file", file, "--content-type", type);

for (const image of images) {
  const filename = basename(image.url);
  upload(filename, join("public/images", filename), "image/webp");
}
upload(RESUME_FILE, join("public", RESUME_FILE), "application/pdf");

console.log(`Seeded ${statements.length} rows and ${images.length + 1} files.`);
