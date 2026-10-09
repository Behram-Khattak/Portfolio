import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../database/schema";

let db: ReturnType<typeof createDb> | undefined;

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const pool = mysql.createPool({ uri: url, connectionLimit: 10, charset: "utf8mb4" });
  return drizzle(pool, { schema, mode: "default" });
}

export function useDb() {
  return (db ??= createDb());
}

export { schema };
