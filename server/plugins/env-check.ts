// Refuse to boot with missing or weak secrets rather than failing later at request time.
export default defineNitroPlugin(() => {
  const problems: string[] = [];
  if (!process.env.DATABASE_URL) problems.push("DATABASE_URL is not set");
  if ((process.env.NUXT_SESSION_PASSWORD ?? "").length < 32)
    problems.push("NUXT_SESSION_PASSWORD must be at least 32 characters");
  if (problems.length) throw new Error(`Invalid environment: ${problems.join("; ")}`);
});
