import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { ENV } from "./_core/env";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function isPostgresConfigured() {
  return Boolean(ENV.postgresDatabaseUrl);
}

export function getPostgresPool() {
  if (!isPostgresConfigured()) return null;
  pool ??= new Pool({ connectionString: ENV.postgresDatabaseUrl, max: 5, ssl: ENV.postgresSsl ? { rejectUnauthorized: false } : false });
  return pool;
}

async function withClient<T>(work: (client: PoolClient) => Promise<T>) {
  const current = getPostgresPool();
  if (!current) throw new Error("POSTGRES_DATABASE_URL is not configured");
  const client = await current.connect();
  try { return await work(client); } finally { client.release(); }
}

export async function ensurePostgresSchema() {
  if (!isPostgresConfigured()) return false;
  schemaReady ??= withClient(async client => {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "openId" VARCHAR(64) NOT NULL UNIQUE,
        "name" TEXT,
        "email" VARCHAR(320),
        "loginMethod" VARCHAR(64),
        "role" VARCHAR(16) NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "lastSignedIn" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS "scans" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER,
        "inputType" VARCHAR(16) NOT NULL,
        "inputLabel" VARCHAR(255) NOT NULL,
        "inputContent" TEXT NOT NULL,
        "score" INTEGER NOT NULL,
        "verdict" VARCHAR(32) NOT NULL,
        "summary" TEXT NOT NULL,
        "evidenceJson" TEXT NOT NULL,
        "nextStepsJson" TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS "storedFiles" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER,
        "scanId" INTEGER,
        "originalName" VARCHAR(255) NOT NULL,
        "mimeType" VARCHAR(128) NOT NULL,
        "sizeBytes" INTEGER NOT NULL,
        "storageKey" VARCHAR(512) NOT NULL,
        "storageUrl" VARCHAR(768) NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS "scans_createdAt_idx" ON "scans" ("createdAt" DESC);
      CREATE INDEX IF NOT EXISTS "storedFiles_scanId_idx" ON "storedFiles" ("scanId");
    `);
  });
  await schemaReady;
  return true;
}

export async function postgresQuery<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []) {
  await ensurePostgresSchema();
  const current = getPostgresPool();
  if (!current) throw new Error("POSTGRES_DATABASE_URL is not configured");
  return current.query<T>(text, values);
}
