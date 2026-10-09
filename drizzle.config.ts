import { defineConfig } from "drizzle-kit";

try {
  process.loadEnvFile();
} catch {
  // no .env file; rely on the real environment
}

export default defineConfig({
  dialect: "mysql",
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  dbCredentials: { url: process.env.DATABASE_MIGRATE_URL! },
});
