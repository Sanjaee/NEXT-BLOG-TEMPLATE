import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DB_URL) {
  throw new Error("DB_URL environment variable is not set");
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const connectionString = process.env.DB_URL;
const client = postgres(connectionString, { max: 1 });

export const db = drizzle(client, { schema });

