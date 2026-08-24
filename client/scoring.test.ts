import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const clientSource = readFileSync(resolve(process.cwd(), "client/src/main.js"), "utf8");
const analyzeSource = clientSource.slice(
  clientSource.indexOf("function analyze"),
  clientSource.indexOf("\nfunction shell"),
);
const analyze = new Function(`${analyzeSource}; return analyze;`)() as (
  type: string,
  raw: string,
  label?: string,
) => { score: number; verdict: string };

describe("phishing score floor", () => {
  it("normalizes a low-signal total below 10 to zero", () => {
    const result = analyze("url", "https://www.example.com/security-center");
    expect(result.score).toBe(0);
    expect(result.verdict).toBe("Low signal");
  });

  it("preserves a score at or above 10", () => {
    const result = analyze("url", "http://secure-wallet.example.top/login");
    expect(result.score).toBeGreaterThanOrEqual(10);
    expect(result.verdict).not.toBe("Low signal");
  });
});
