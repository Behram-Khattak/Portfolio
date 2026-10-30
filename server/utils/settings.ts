import { eq } from "drizzle-orm";
import { settingsSchemas, type SettingsKey, type SiteSettings } from "#shared/utils/schemas";

// Used until a key has been saved from the dashboard or seeded
export const settingsDefaults: SiteSettings = {
  site: { name: "Behram Khattak", role: "Full-Stack & AI Engineer", description: "Websites, custom web and mobile apps, and AI-powered products." },
  contact: { email: "hello@example.com", phone: "", whatsapp: "", location: "", availability: "" },
  socials: { github: "", linkedin: "", youtube: "", x: "" },
  hero: {
    headline: "Every Business Needs a Software",
    subhead: "From websites and custom web and mobile apps to AI-powered tools, I design, build and maintain software that helps your business run and grow.",
  },
  about: { heading: "About", body: "", profileMediaId: null },
};

export async function getSettings(): Promise<SiteSettings> {
  const rows = await useDb().select().from(schema.settings);
  const stored = new Map(rows.map((r) => [r.key, r.value]));
  const result = {} as Record<SettingsKey, unknown>;
  for (const key of Object.keys(settingsSchemas) as SettingsKey[]) {
    const parsed = settingsSchemas[key].safeParse(stored.get(key));
    result[key] = parsed.success ? parsed.data : settingsDefaults[key];
  }
  return result as SiteSettings;
}

export async function getResume() {
  const [row] = await useDb().select().from(schema.settings).where(eq(schema.settings.key, "resume")).limit(1);
  const value = row?.value as { file?: unknown; name?: unknown } | undefined;
  if (typeof value?.file !== "string") return null;
  return { file: value.file, name: typeof value.name === "string" ? value.name : "resume.pdf" };
}
