import type { z } from "zod";
import {
  experienceSchema,
  postSchema,
  projectSchema,
  serviceSchema,
  settingsSchemas,
  skillSchema,
} from "#shared/utils/schemas";

export type AdminField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "markdown" | "slug" | "url" | "number" | "boolean" | "tags" | "list" | "media" | "gallery" | "service" | "icon";
  hint?: string;
  // For slug fields: the field the slug is generated from while creating
  from?: string;
  wide?: boolean;
};

export type AdminResource = {
  title: string;
  singular: string;
  schema: z.ZodObject;
  labelKey: string;
  columns: { key: string; label: string }[];
  defaults: Record<string, unknown>;
  fields: AdminField[];
  // Public URL of an item, for the "View" link
  publicPath?: (item: Record<string, any>) => string;
};

const sortOrder: AdminField = { key: "sortOrder", label: "Sort order", type: "number", hint: "Lower numbers appear first" };
const iconHint = "For example lucide:bot or simple-icons:laravel. Browse names at icon-sets.iconify.design";

export const adminResources: Record<string, AdminResource> = {
  projects: {
    title: "Projects",
    singular: "project",
    schema: projectSchema,
    labelKey: "title",
    columns: [{ key: "title", label: "Title" }, { key: "client", label: "Client" }, { key: "year", label: "Year" }],
    defaults: { slug: "", title: "", summary: "", body: "", client: "", role: "", year: "", tech: [], liveUrl: "", repoUrl: "", serviceId: null, coverMediaId: null, gallery: [], featured: false, published: false, sortOrder: 0 },
    publicPath: (item) => `/projects/${item.slug}`,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "URL slug", type: "slug", from: "title" },
      { key: "summary", label: "Summary", type: "textarea", hint: "One or two sentences shown on cards and at the top of the page", wide: true },
      { key: "body", label: "Case study", type: "markdown", hint: "The problem, what you built, and the result", wide: true },
      { key: "client", label: "Client", type: "text" },
      { key: "role", label: "Your role", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "serviceId", label: "Service type", type: "service" },
      { key: "tech", label: "Tech stack", type: "tags", hint: "Comma separated", wide: true },
      { key: "liveUrl", label: "Live URL", type: "url" },
      { key: "repoUrl", label: "Repository URL", type: "url" },
      { key: "coverMediaId", label: "Cover image", type: "media", wide: true },
      { key: "gallery", label: "Gallery", type: "gallery", wide: true },
      sortOrder,
      { key: "featured", label: "Feature on the homepage", type: "boolean" },
      { key: "published", label: "Published", type: "boolean" },
    ],
  },
  posts: {
    title: "Blog posts",
    singular: "post",
    schema: postSchema,
    labelKey: "title",
    columns: [{ key: "title", label: "Title" }, { key: "publishedAt", label: "Published on" }],
    defaults: { slug: "", title: "", excerpt: "", body: "", coverMediaId: null, tags: [], published: false },
    publicPath: (item) => `/blog/${item.slug}`,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "URL slug", type: "slug", from: "title" },
      { key: "excerpt", label: "Excerpt", type: "textarea", hint: "Shown in the post list and in search results", wide: true },
      { key: "body", label: "Body", type: "markdown", wide: true },
      { key: "tags", label: "Tags", type: "tags", hint: "Comma separated", wide: true },
      { key: "coverMediaId", label: "Cover image", type: "media", wide: true },
      { key: "published", label: "Published", type: "boolean" },
    ],
  },
  services: {
    title: "Services",
    singular: "service",
    schema: serviceSchema,
    labelKey: "title",
    columns: [{ key: "title", label: "Title" }, { key: "tagline", label: "Tagline" }],
    defaults: { slug: "", title: "", tagline: "", description: "", icon: "lucide:sparkles", deliverables: [], sortOrder: 0, published: true },
    publicPath: (item) => `/services#${item.slug}`,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "URL slug", type: "slug", from: "title" },
      { key: "tagline", label: "Tagline", type: "text", wide: true },
      { key: "description", label: "Description", type: "textarea", hint: "Leave a blank line between paragraphs", wide: true },
      { key: "deliverables", label: "What's included", type: "list", hint: "One item per line", wide: true },
      { key: "icon", label: "Icon", type: "icon", hint: iconHint },
      sortOrder,
      { key: "published", label: "Published", type: "boolean" },
    ],
  },
  experiences: {
    title: "Experience",
    singular: "role",
    schema: experienceSchema,
    labelKey: "company",
    columns: [{ key: "company", label: "Company" }, { key: "role", label: "Role" }, { key: "timeline", label: "Dates" }],
    defaults: { company: "", role: "", timeline: "", summary: "", link: "", logoMediaId: null, sortOrder: 0 },
    fields: [
      { key: "company", label: "Company", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "timeline", label: "Dates", type: "text", hint: "For example March 2025 - September 2025" },
      { key: "link", label: "Company website", type: "url" },
      { key: "summary", label: "Summary", type: "textarea", wide: true },
      { key: "logoMediaId", label: "Logo", type: "media", wide: true },
      sortOrder,
    ],
  },
  skills: {
    title: "Skills",
    singular: "skill",
    schema: skillSchema,
    labelKey: "name",
    columns: [{ key: "name", label: "Name" }, { key: "category", label: "Category" }],
    defaults: { name: "", icon: "lucide:code", category: "", sortOrder: 0 },
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "category", label: "Category", type: "text", hint: "Skills with the same category are grouped on the About page" },
      { key: "icon", label: "Icon", type: "icon", hint: iconHint },
      sortOrder,
    ],
  },
};

export const settingsForms: Record<keyof typeof settingsSchemas, { title: string; fields: AdminField[] }> = {
  site: {
    title: "Site identity",
    fields: [
      { key: "name", label: "Your name", type: "text" },
      { key: "role", label: "Job title", type: "text" },
      { key: "description", label: "Site description", type: "textarea", hint: "Used for search engines and link previews", wide: true },
    ],
  },
  contact: {
    title: "Contact details",
    fields: [
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone, as displayed", type: "text" },
      { key: "whatsapp", label: "WhatsApp number", type: "text", hint: "Digits only with country code, for example 97466917419" },
      { key: "location", label: "Location", type: "text" },
      { key: "availability", label: "Availability status", type: "text", hint: "Shown at the top of the homepage. Leave empty to hide it", wide: true },
    ],
  },
  socials: {
    title: "Social links",
    fields: [
      { key: "github", label: "GitHub", type: "url" },
      { key: "linkedin", label: "LinkedIn", type: "url" },
      { key: "youtube", label: "YouTube", type: "url" },
      { key: "x", label: "X (Twitter)", type: "url" },
    ],
  },
  hero: {
    title: "Homepage hero",
    fields: [
      { key: "headline", label: "Headline", type: "text", wide: true },
      { key: "subhead", label: "Supporting text", type: "textarea", wide: true },
    ],
  },
  about: {
    title: "About page",
    fields: [
      { key: "heading", label: "Heading", type: "text", wide: true },
      { key: "body", label: "Bio", type: "markdown", wide: true },
      { key: "profileMediaId", label: "Profile photo", type: "media", wide: true },
    ],
  },
};

// A signed-out page load goes to GitHub. A failed save stays put, so unsaved work isn't lost.
export const adminFetch = $fetch.create({
  onResponseError({ response, options }) {
    if (response.status === 401 && import.meta.client && (options.method ?? "GET") === "GET") window.location.href = "/auth/github";
  },
});

export const adminNav: { title?: string; items: { to: string; label: string; icon: string; exact?: boolean }[] }[] = [
  { items: [{ to: "/admin", label: "Overview", icon: "lucide:house", exact: true }] },
  {
    title: "Content",
    items: [
      { to: "/admin/projects", label: "Projects", icon: "lucide:folder-kanban" },
      { to: "/admin/posts", label: "Blog posts", icon: "lucide:pen-line" },
      { to: "/admin/services", label: "Services", icon: "lucide:layers" },
      { to: "/admin/media", label: "Images", icon: "lucide:image" },
    ],
  },
  {
    title: "Pages",
    items: [
      { to: "/admin/content", label: "Page content", icon: "lucide:file-text" },
      { to: "/admin/experiences", label: "Experience", icon: "lucide:briefcase" },
      { to: "/admin/skills", label: "Skills", icon: "lucide:wrench" },
    ],
  },
  { title: "Inbox", items: [{ to: "/admin/inquiries", label: "Inquiries", icon: "lucide:inbox" }] },
  { title: "Site", items: [{ to: "/admin/settings", label: "Settings", icon: "lucide:settings" }] },
];

export function errorMessage(error: unknown, fallback = "Something went wrong. Try again.") {
  const e = error as { data?: { statusMessage?: string }; statusMessage?: string };
  return e?.data?.statusMessage || e?.statusMessage || fallback;
}

export function fieldErrors(error: z.ZodError) {
  return Object.fromEntries(error.issues.map((issue) => [String(issue.path[0]), issue.message]));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
