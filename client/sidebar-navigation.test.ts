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

  it("moves the primary spark left and increases the gold spark treatment", () => {
    expect(styleSource).toContain(".gold-spark{font-size:29px;font-weight:700");
    expect(styleSource).toContain(".spark-one{top:2px;left:3%;transform:translateX(-50%)}");
    expect(styleSource).toContain(".spark-two{top:22px;right:10%;font-size:21px}");
    expect(styleSource).toContain(".spark-three{bottom:4px;left:7%;font-size:18px}");
    expect(styleSource).toContain("@media(max-width:700px){.gold-spark{font-size:24px}");
  });

  it("places a larger static spark to the left of the ADYA wordmark", () => {
    expect(clientSource).toContain('<span class="brand-spark" aria-hidden="true">✦</span>');
    expect(clientSource).toContain('<span class="brand-name"><b>ADYA</b><em>VIGIL AI</em></span>');
    expect(styleSource).toContain(".brand-wordmark{display:flex!important;flex-direction:row!important;align-items:center;gap:7px");
    expect(styleSource).toContain(".brand-spark{display:grid;place-items:center;width:24px;height:32px");
    expect(styleSource).toContain("font-size:27px;font-weight:700");
    expect(styleSource).toContain("animation:none!important");
    expect(styleSource).toContain("@media(max-width:700px){.brand-wordmark{gap:5px}.brand-spark{width:21px");
  });

  it("omits only the Dashboard security-posture marker", () => {
    expect(clientSource).toContain('showMarker = true');
    expect(clientSource).toContain('class="signal-line"></span>\' : ""');
    expect(clientSource).toContain('DASHBOARD / SECURITY POSTURE</div><h1>Your signal desk.</h1>');
    expect(clientSource).toContain('function dashboardHeader(action)');
    expect(clientSource).toContain('dashboardHeader(`<a href="/scan" class="button primary"><span class="button-icon">${QR_SCAN_ICON}</span> New scan <span>↗</span></a>`');
  });

  it("uses calendar and QR scanning SVG icons only for Dashboard and Scan center", () => {
    expect(clientSource).toContain("const CALENDAR_ICON = `<svg");
    expect(clientSource).toContain("const QR_SCAN_ICON = `<svg");
    expect(clientSource).toContain('label: "Dashboard", icon: CALENDAR_ICON');
    expect(clientSource).toContain('label: "Scan center", icon: QR_SCAN_ICON');
  });
});
