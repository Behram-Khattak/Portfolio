import {
  boolean,
  index,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

const id = () => int("id").autoincrement().primaryKey();
const createdAt = () => timestamp("created_at").notNull().defaultNow();
const updatedAt = () => timestamp("updated_at").notNull().defaultNow().onUpdateNow();

export const users = mysqlTable("users", {
  id: id(),
  email: varchar("email", { length: 191 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  // AES-256-GCM encrypted base32 secret; null until 2FA is enabled
  totpSecret: varchar("totp_secret", { length: 255 }),
  totpEnabled: boolean("totp_enabled").notNull().default(false),
  // Bumped on password change to invalidate every existing session
  sessionVersion: int("session_version").notNull().default(1),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const media = mysqlTable("media", {
  id: id(),
  filename: varchar("filename", { length: 64 }).notNull().unique(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  alt: varchar("alt", { length: 255 }).notNull().default(""),
  width: int("width").notNull(),
  height: int("height").notNull(),
  size: int("size").notNull(),
  createdAt: createdAt(),
});

export const services = mysqlTable("services", {
  id: id(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  tagline: varchar("tagline", { length: 255 }).notNull().default(""),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 80 }).notNull().default("lucide:sparkles"),
  deliverables: json("deliverables").$type<string[]>().notNull(),
  sortOrder: int("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const projects = mysqlTable(
  "projects",
  {
    id: id(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    title: varchar("title", { length: 160 }).notNull(),
    summary: varchar("summary", { length: 500 }).notNull(),
    body: text("body").notNull(),
    client: varchar("client", { length: 160 }).notNull().default(""),
    role: varchar("role", { length: 160 }).notNull().default(""),
    year: varchar("year", { length: 20 }).notNull().default(""),
    tech: json("tech").$type<string[]>().notNull(),
    liveUrl: varchar("live_url", { length: 500 }).notNull().default(""),
    repoUrl: varchar("repo_url", { length: 500 }).notNull().default(""),
    serviceId: int("service_id"),
    coverMediaId: int("cover_media_id"),
    gallery: json("gallery").$type<number[]>().notNull(),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(false),
    sortOrder: int("sort_order").notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("projects_published_idx").on(t.published, t.sortOrder)],
);

export const posts = mysqlTable(
  "posts",
  {
    id: id(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    excerpt: varchar("excerpt", { length: 500 }).notNull().default(""),
    body: text("body").notNull(),
    coverMediaId: int("cover_media_id"),
    tags: json("tags").$type<string[]>().notNull(),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("posts_published_idx").on(t.published, t.publishedAt)],
);

export const experiences = mysqlTable("experiences", {
  id: id(),
  company: varchar("company", { length: 160 }).notNull(),
  role: varchar("role", { length: 160 }).notNull(),
  timeline: varchar("timeline", { length: 120 }).notNull(),
  summary: text("summary").notNull(),
  link: varchar("link", { length: 500 }).notNull().default(""),
  logoMediaId: int("logo_media_id"),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const skills = mysqlTable("skills", {
  id: id(),
  name: varchar("name", { length: 80 }).notNull(),
  icon: varchar("icon", { length: 80 }).notNull().default("lucide:code"),
  category: varchar("category", { length: 60 }).notNull().default("General"),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 60 }).primaryKey(),
  value: json("value").$type<unknown>().notNull(),
  updatedAt: updatedAt(),
});

export const inquiries = mysqlTable(
  "inquiries",
  {
    id: id(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    company: varchar("company", { length: 160 }).notNull().default(""),
    service: varchar("service", { length: 160 }).notNull().default(""),
    budget: varchar("budget", { length: 60 }).notNull().default(""),
    message: text("message").notNull(),
    ip: varchar("ip", { length: 64 }).notNull().default(""),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [index("inquiries_read_idx").on(t.isRead, t.createdAt)],
);

export const loginAttempts = mysqlTable(
  "login_attempts",
  {
    id: id(),
    email: varchar("email", { length: 191 }).notNull(),
    ip: varchar("ip", { length: 64 }).notNull(),
    success: boolean("success").notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    index("login_attempts_ip_idx").on(t.ip, t.createdAt),
    index("login_attempts_email_idx").on(t.email, t.createdAt),
  ],
);

export const auditLogs = mysqlTable(
  "audit_logs",
  {
    id: id(),
    userId: int("user_id"),
    action: varchar("action", { length: 60 }).notNull(),
    entity: varchar("entity", { length: 60 }).notNull().default(""),
    entityId: varchar("entity_id", { length: 60 }).notNull().default(""),
    detail: varchar("detail", { length: 255 }).notNull().default(""),
    ip: varchar("ip", { length: 64 }).notNull().default(""),
    createdAt: createdAt(),
  },
  (t) => [index("audit_logs_created_idx").on(t.createdAt)],
);
