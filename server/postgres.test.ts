import { describe, expect, it } from "vitest";
import { getPostgresPool, isPostgresConfigured } from "./postgres";

describe("postgres adapter", () => {
  it("stays inactive when no PostgreSQL connection string is configured", () => {
    const original = process.env.POSTGRES_DATABASE_URL;
    delete process.env.POSTGRES_DATABASE_URL;
    expect(isPostgresConfigured()).toBe(false);
    expect(getPostgresPool()).toBeNull();
    if (original) process.env.POSTGRES_DATABASE_URL = original;
  });
});
