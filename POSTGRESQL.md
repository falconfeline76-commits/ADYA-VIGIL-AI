# ADYA VIGIL AI PostgreSQL readiness

The browser interface is now implemented with semantic HTML rendered by a vanilla JavaScript module and a standalone CSS theme. The current managed preview continues to use its provisioned database for live validation because the project platform supplies a MySQL/TiDB `DATABASE_URL` by default.

A PostgreSQL adapter is included at `server/postgres.ts`. It uses the server-only `POSTGRES_DATABASE_URL` variable, creates the equivalent `users`, `scans`, and `storedFiles` tables on first connection, and keeps SSL enabled by default. The adapter is intentionally inactive when the variable is absent, so the managed preview remains available while the external PostgreSQL connection is being supplied.

To activate PostgreSQL for a deployment, add `POSTGRES_DATABASE_URL` with a value such as `postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require`. If the provider does not support certificate verification in the deployment environment, set `POSTGRES_SSL=false` only when that decision is understood and approved. The connection string must never be placed in the vanilla client or committed to source control.

The existing MySQL/TiDB Drizzle path remains the active runtime path until the PostgreSQL connection secret is supplied and the final adapter switch is approved. This avoids silently pointing production at an unavailable or unintended database.
