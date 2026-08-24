import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const clientSource = readFileSync(resolve(process.cwd(), "client/src/main.js"), "utf8");
const styleSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("sidebar navigation refinements", () => {
  it("uses a cyber-security label instead of the removed Security desk label", () => {
    expect(clientSource).toContain("CYBER DEFENSE NETWORK");
    expect(clientSource).toContain("LIVE SIGNAL MONITOR");
    expect(clientSource).not.toContain("Security desk / 0.9.4");
    expect(clientSource).not.toContain("Local model online");
    expect(clientSource).not.toContain("RULESET 0.9.4 · READY");
    expect(clientSource).not.toContain("Your content stays in this workspace");
    expect(clientSource).toContain("THREAT MATRIX");
    expect(clientSource).toContain("LIVE // EDGE MONITOR");
    expect(clientSource).toContain("ENCRYPTED SIGNAL CHANNEL");
  });

  it("keeps the static falcon centered with explicit right-side box padding", () => {
    expect(styleSource).toContain(".brand-mark-3d{box-sizing:border-box;width:62px;min-width:62px;height:58px;padding:0 8px 0 4px");
    expect(styleSource).toContain(".brand-fire-falcon{box-sizing:border-box;width:100%;height:100%;display:grid;place-items:center;padding-right:3px}");
    expect(styleSource).toContain(".brand-mark-3d{padding:0!important;place-items:center!important");
    expect(styleSource).toContain(".brand-fire-falcon{padding:0!important;place-items:center!important");
  });

  it("omits only the Dashboard security-posture marker", () => {
    expect(clientSource).toContain('showMarker = true');
    expect(clientSource).toContain('class="signal-line"></span>\' : ""');
    expect(clientSource).toContain('DASHBOARD / SECURITY POSTURE", "Your signal desk."');
    expect(clientSource).toContain('class="button-icon">${QR_SCAN_ICON}</span> New scan <span>↗</span></a>`, false)');
  });

  it("uses calendar and QR scanning SVG icons only for Dashboard and Scan center", () => {
    expect(clientSource).toContain("const CALENDAR_ICON = `<svg");
    expect(clientSource).toContain("const QR_SCAN_ICON = `<svg");
    expect(clientSource).toContain('label: "Dashboard", icon: CALENDAR_ICON');
    expect(clientSource).toContain('label: "Scan center", icon: QR_SCAN_ICON');
  });
});
