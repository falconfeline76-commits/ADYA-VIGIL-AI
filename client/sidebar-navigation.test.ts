import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const clientSource = readFileSync(resolve(process.cwd(), "client/src/main.js"), "utf8");

describe("sidebar navigation refinements", () => {
  it("uses a cyber-security label instead of the removed Security desk label", () => {
    expect(clientSource).toContain("CYBER DEFENSE NETWORK");
    expect(clientSource).toContain("LIVE SIGNAL MONITOR");
    expect(clientSource).not.toContain("Security desk / 0.9.4");
  });

  it("uses calendar and QR scanning SVG icons only for Dashboard and Scan center", () => {
    expect(clientSource).toContain("const CALENDAR_ICON = `<svg");
    expect(clientSource).toContain("const QR_SCAN_ICON = `<svg");
    expect(clientSource).toContain('label: "Dashboard", icon: CALENDAR_ICON');
    expect(clientSource).toContain('label: "Scan center", icon: QR_SCAN_ICON');
  });
});
