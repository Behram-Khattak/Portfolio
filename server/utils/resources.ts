import { asc, desc, type SQL } from "drizzle-orm";
import type { MySqlColumn, MySqlTable } from "drizzle-orm/mysql-core";
import type { z } from "zod";
import {
  experienceSchema,
  postSchema,
  projectSchema,
  serviceSchema,
  skillSchema,
} from "#shared/utils/schemas";

type Resource = {
  table: MySqlTable & { id: MySqlColumn };
  schema: z.ZodObject;
  orderBy: SQL[];
  // Column shown in audit log entries
  label: string;
  // Derives server-controlled columns from the validated input
  prepare?: (data: Record<string, any>, existing?: Record<string, any>) => Record<string, any>;
};

const { experiences, posts, projects, services, skills } = schema;

// Content types managed through the generic /api/admin/[resource] endpoints
export const resources: Record<string, Resource> = {
  projects: {
    table: projects,
    schema: projectSchema,
    orderBy: [asc(projects.sortOrder), desc(projects.id)],
    label: "title",
  },
  services: {
    table: services,
    schema: serviceSchema,
    orderBy: [asc(services.sortOrder), asc(services.id)],
    label: "title",
  },
  posts: {
    table: posts,
    schema: postSchema,
    orderBy: [desc(posts.createdAt)],
    label: "title",
    prepare: (data, existing) => ({
      ...data,
      publishedAt: data.published ? (existing?.publishedAt ?? new Date()) : null,
    }),
  },
  experiences: {
    table: experiences,
    schema: experienceSchema,
    orderBy: [asc(experiences.sortOrder), desc(experiences.id)],
    label: "company",
  },
  skills: {
    table: skills,
    schema: skillSchema,
    orderBy: [asc(skills.sortOrder), asc(skills.id)],
    label: "name",
  },
};

export function getResource(name: string | undefined) {
  const resource = name && Object.hasOwn(resources, name) ? resources[name] : undefined;
  if (!resource) throw createError({ statusCode: 404, statusMessage: "Not found" });
  return resource;
}

export function parseId(value: string | undefined) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 404, statusMessage: "Not found" });
  return id;
}

// Unique-key violations (duplicate slug) become a readable 409 instead of a 500
export function rethrowDbError(error: unknown): never {
  if ((error as { cause?: { code?: string } })?.cause?.code === "ER_DUP_ENTRY" || (error as { code?: string })?.code === "ER_DUP_ENTRY")
    throw createError({ statusCode: 409, statusMessage: "That slug is already in use" });
  throw error;
}
