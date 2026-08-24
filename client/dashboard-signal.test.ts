import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const clientSource = readFileSync(resolve(process.cwd(), "client/src/main.js"), "utf8");
const styleSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("dashboard cyber-security perimeter visual", () => {
  it("replaces the previous signal map beside the Dashboard heading", () => {
    expect(clientSource).toContain("function dashboardSignalVisual()");
    expect(clientSource).toContain('class="dashboard-signal-visual"');
    expect(clientSource).toContain('aria-label="Live cyber-security signal telemetry"');
    expect(clientSource).toContain('class="dashboard-heading-side"');
    expect(clientSource).toContain("CYBERNETIC PERIMETER");
    expect(clientSource).toContain("THREAT SHIELD");
    expect(clientSource).toContain("VIGIL NODE");
    expect(clientSource).toContain("perimeter-core");
    expect(clientSource).not.toContain("LIVE / SIGNAL MAP");
    expect(clientSource).not.toContain("THREAT SCAN");
  });

  it("keeps the replacement contained, padded, animated, and responsive", () => {
    expect(styleSource).toContain(".dashboard-page-header{display:grid;grid-template-columns:minmax(0,1fr) minmax(248px,292px)");
    expect(styleSource).toContain(".dashboard-signal-visual{min-height:198px;padding:16px 17px 14px");
    expect(styleSource).toContain(".cyber-perimeter{position:absolute;inset:39px 31px 36px");
    expect(styleSource).toContain("@keyframes perimeterRadar");
    expect(styleSource).toContain("@keyframes perimeterCorePulse");
    expect(styleSource).toContain("@media(max-width:700px){.dashboard-page-header{display:flex;flex-direction:column");
    expect(styleSource).toContain("@media(prefers-reduced-motion:reduce){.cyber-radar-sweep,.cyber-perimeter:before,.ring-one,.ring-two,.ring-three,.perimeter-core,.perimeter-node,.core-circuit{animation:none!important}");
  });
});
