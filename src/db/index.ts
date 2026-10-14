import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL && typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // Ignore if .env does not exist
  }
}

const connectionString = process.env.DATABASE_URL || "";

// Neon HTTP client for serverless Next.js
const sql = neon(connectionString || "postgresql://dummy:dummy@ep-empty.dummy.neon.tech/neondb");

export const db = drizzle(sql, { schema });

export { schema };
