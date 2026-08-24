import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const clientSource = readFileSync(resolve(process.cwd(), "client/src/main.js"), "utf8");
const styleSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("dashboard cyber-security signal visual", () => {
  it("renders beside the Dashboard heading with project-specific telemetry labels", () => {
    expect(clientSource).toContain("function dashboardSignalVisual()");
    expect(clientSource).toContain('class="dashboard-signal-visual"');
    expect(clientSource).toContain('aria-label="Live cyber-security signal telemetry"');
    expect(clientSource).toContain("LIVE / SIGNAL MAP");
    expect(clientSource).toContain("THREAT SCAN");
    expect(clientSource).toContain("CHANNEL 07");
    expect(clientSource).toContain("VIGIL NODE");
    expect(clientSource).toContain("dashboardHeader(");
  });

  it("keeps the visual padded, animated, and responsive with reduced-motion support", () => {
    expect(styleSource).toContain(".dashboard-page-header{display:grid;grid-template-columns:minmax(0,1fr) minmax(248px,292px)");
    expect(styleSource).toContain(".dashboard-signal-visual{position:relative;min-height:184px;padding:17px 18px 14px");
    expect(styleSource).toContain("@keyframes signalSweep");
    expect(styleSource).toContain("@keyframes signalCorePulse");
    expect(styleSource).toContain("@media(max-width:700px){.dashboard-page-header{display:flex;flex-direction:column");
    expect(styleSource).toContain("@media(prefers-reduced-motion:reduce){.dashboard-signal-visual:after,.signal-visual-core,.ring-outer,.ring-inner,.signal-node,.signal-bars i{animation:none!important}");
  });
});
