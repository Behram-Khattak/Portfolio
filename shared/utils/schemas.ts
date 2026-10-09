import { z } from "zod";

// Validation schemas shared by the admin forms (client) and the API (server).

const text = (max: number) => z.string().trim().max(max);
const required = (max: number) => z.string().trim().min(1, "Required").max(max);
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");
const httpUrl = z.union([
  z.literal(""),
  z.url({ protocol: /^https?$/, error: "Must be an http(s) URL" }).max(500),
]);
const icon = z
  .string()
  .trim()
  .regex(/^(lucide|simple-icons):[a-z0-9-]+$/, "Use lucide:name or simple-icons:name")
  .max(80);
const mediaId = z.number().int().positive().nullable();
const sortOrder = z.number().int().min(0).max(100000);
const stringList = (maxItems: number, maxLen: number) =>
  z.array(required(maxLen)).max(maxItems);

export const serviceSchema = z.object({
  slug,
  title: required(160),
  tagline: text(255),
  description: required(10000),
  icon,
  deliverables: stringList(20, 200),
  sortOrder,
  published: z.boolean(),
});

export const projectSchema = z.object({
  slug,
  title: required(160),
  summary: required(500),
  body: text(50000),
  client: text(160),
  role: text(160),
  year: text(20),
  tech: stringList(30, 40),
  liveUrl: httpUrl,
  repoUrl: httpUrl,
  serviceId: z.number().int().positive().nullable(),
  coverMediaId: mediaId,
  gallery: z.array(z.number().int().positive()).max(20),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder,
});

export const postSchema = z.object({
  slug: slug.max(160),
  title: required(200),
  excerpt: text(500),
  body: required(100000),
  coverMediaId: mediaId,
  tags: stringList(12, 40),
  published: z.boolean(),
});

export const experienceSchema = z.object({
  company: required(160),
  role: required(160),
  timeline: required(120),
  summary: required(5000),
  link: httpUrl,
  logoMediaId: mediaId,
  sortOrder,
});

export const skillSchema = z.object({
  name: required(80),
  icon,
  category: required(60),
  sortOrder,
});

export const settingsSchemas = {
  site: z.object({
    name: required(80),
    role: required(120),
    description: required(300),
  }),
  contact: z.object({
    email: z.email().max(191),
    phone: text(40),
    // Digits only, international format without "+", used for wa.me links
    whatsapp: z.string().trim().regex(/^\d{0,15}$/, "Digits only, with country code"),
    location: text(120),
    availability: text(160),
  }),
  socials: z.object({
    github: httpUrl,
    linkedin: httpUrl,
    youtube: httpUrl,
    x: httpUrl,
  }),
  hero: z.object({
    headline: required(160),
    subhead: required(400),
  }),
  about: z.object({
    heading: required(160),
    body: required(10000),
    profileMediaId: mediaId,
  }),
} as const;

export type SettingsKey = keyof typeof settingsSchemas;
export type SiteSettings = { [K in SettingsKey]: z.infer<(typeof settingsSchemas)[K]> };

export const mediaUpdateSchema = z.object({ alt: text(255) });

export const loginSchema = z.object({
  email: z.email().max(191),
  password: z.string().min(1).max(200),
  code: z.string().trim().regex(/^\d{6}$/).optional(),
});

export const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters")
  .max(200);

export const passwordChangeSchema = z.object({
  current: z.string().min(1).max(200),
  next: passwordSchema,
});

export const totpCodeSchema = z.object({
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.email("Please enter a valid email").max(191),
  company: text(160),
  service: text(160),
  budget: text(60),
  message: z.string().trim().min(20, "A little more detail helps (20+ characters)").max(5000),
  // Honeypot: real visitors never see or fill this field
  website: z.string().max(200),
  // Client timestamp of when the form was rendered
  startedAt: z.number(),
});
