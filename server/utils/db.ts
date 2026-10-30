import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle as drizzleProxy } from "drizzle-orm/sqlite-proxy";
import * as schema from "../database/schema";

type Db = DrizzleD1Database<typeof schema>;

// The D1 binding only exists inside the Worker. Pages are pre-rendered in Node, where the
// same queries go through D1's HTTP API with a read-only token from the build environment.
function createHttpDb() {
  const { D1_ACCOUNT_ID, D1_DATABASE_ID, D1_API_TOKEN } = process.env;
  if (!D1_ACCOUNT_ID || !D1_DATABASE_ID || !D1_API_TOKEN) {
    throw new Error("D1_ACCOUNT_ID, D1_DATABASE_ID and D1_API_TOKEN must be set to pre-render pages");
  }
  const url = `https://api.cloudflare.com/client/v4/accounts/${D1_ACCOUNT_ID}/d1/database/${D1_DATABASE_ID}/raw`;

  return drizzleProxy(
    async (sql, params, method) => {
      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${D1_API_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ sql, params }),
      });
      if (!response.ok) throw new Error(`D1 query failed (${response.status}): ${await response.text()}`);
      const payload = (await response.json()) as { result: { results: { rows: unknown[][] } }[] };
      const rows = payload.result[0]?.results.rows ?? [];
      return { rows: method === "get" ? (rows[0] ?? []) : rows } as { rows: any[] };
    },
    { schema },
  ) as unknown as Db;
}

let httpDb: Db | undefined;

export function useDb(): Db {
  const binding = useEvent().context.cloudflare?.env?.DB;
  if (binding) return drizzle(binding, { schema });
  return (httpDb ??= createHttpDb());
}

export { schema };
