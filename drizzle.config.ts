import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const host = process.env.SQL_HOST || process.env.PGHOST || "localhost";
const port = Number(process.env.SQL_PORT || process.env.PGPORT || 5432);
const user = process.env.SQL_USER || process.env.SQL_ADMIN_USER || process.env.PGUSER || "postgres";
const password = process.env.SQL_PASSWORD || process.env.SQL_ADMIN_PASSWORD || process.env.PGPASSWORD || "";
const database = process.env.SQL_DB_NAME || process.env.PGDATABASE || "charade_db";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: connectionString
    ? { url: connectionString }
    : {
        host,
        port,
        user,
        password,
        database,
        ssl: false,
      },
  verbose: true,
});
