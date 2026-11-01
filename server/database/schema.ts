import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const id = () => integer("id").primaryKey({ autoIncrement: true });
const flag = (name: string) => integer(name, { mode: "boolean" });
const timestamp = (name: string) => integer(name, { mode: "timestamp" });
const createdAt = () => timestamp("created_at").notNull().default(sql`(unixepoch())`);
const updatedAt = () =>
  timestamp("updated_at")
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => new Date());
export type InquiryDetails = Partial<Record<(typeof INQUIRY_DETAIL_KEYS)[number], string | string[]>>;
export const INQUIRY_DETAIL_KEYS = ["services", "stage", "features", "timeline", "preferredDate", "preferredTime", "meetingType", "timezone", "phone", "contactMethod", "companySize", "website"] as const;

const json = <T>(name: string) => text(name, { mode: "json" }).$type<T>();

export const media = sqliteTable("media", {
  id: id(),
  // R2 object key; the -sm thumbnail sits next to it
  filename: text("filename").notNull().unique(),
  originalName: text("original_name").notNull(),
  alt: text("alt").notNull().default(""),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  size: integer("size").notNull(),
  createdAt: createdAt(),
});

const mediaRef = (name: string) => integer(name).references(() => media.id, { onDelete: "restrict" });

export const services = sqliteTable("services", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("lucide:sparkles"),
  deliverables: json<string[]>("deliverables").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  published: flag("published").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const projects = sqliteTable(
  "projects",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    body: text("body").notNull(),
    client: text("client").notNull().default(""),
    role: text("role").notNull().default(""),
    year: text("year").notNull().default(""),
    tech: json<string[]>("tech").notNull(),
    liveUrl: text("live_url").notNull().default(""),
    repoUrl: text("repo_url").notNull().default(""),
    serviceId: integer("service_id").references(() => services.id, { onDelete: "restrict" }),
    coverMediaId: mediaRef("cover_media_id"),
    gallery: json<number[]>("gallery").notNull(),
    featured: flag("featured").notNull().default(false),
    published: flag("published").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("projects_published_idx").on(t.published, t.sortOrder)],
);

export const posts = sqliteTable(
  "posts",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    body: text("body").notNull(),
    coverMediaId: mediaRef("cover_media_id"),
    tags: json<string[]>("tags").notNull(),
    published: flag("published").notNull().default(false),
    publishedAt: timestamp("published_at"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("posts_published_idx").on(t.published, t.publishedAt)],
);

export const experiences = sqliteTable("experiences", {
  id: id(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  timeline: text("timeline").notNull(),
  summary: text("summary").notNull(),
  link: text("link").notNull().default(""),
  logoMediaId: mediaRef("logo_media_id"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const skills = sqliteTable("skills", {
  id: id(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("lucide:code"),
  category: text("category").notNull().default("General"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: json<unknown>("value").notNull(),
  updatedAt: updatedAt(),
});

export const inquiries = sqliteTable(
  "inquiries",
  {
    id: id(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company").notNull().default(""),
    service: text("service").notNull().default(""),
    budget: text("budget").notNull().default(""),
    message: text("message").notNull(),
    kind: text("kind").notNull().default("project"),
    // Everything else from the brief, shown as labelled rows in the dashboard
    details: json<InquiryDetails>("details").notNull().default({}),
    ip: text("ip").notNull().default(""),
    isRead: flag("is_read").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [index("inquiries_read_idx").on(t.isRead, t.createdAt)],
);

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: id(),
    // GitHub username of the admin
    actor: text("actor").notNull().default(""),
    action: text("action").notNull(),
    entity: text("entity").notNull().default(""),
    entityId: text("entity_id").notNull().default(""),
    detail: text("detail").notNull().default(""),
    ip: text("ip").notNull().default(""),
    createdAt: createdAt(),
  },
  (t) => [index("audit_logs_created_idx").on(t.createdAt)],
);
