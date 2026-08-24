import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const clientSource = readFileSync(resolve(process.cwd(), "client/src/main.js"), "utf8");
const styleSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("3D falcon defense treatment", () => {
  it("renders layered shield, falcon, and wing elements in the dashboard visualization", () => {
    expect(clientSource).toContain('class="shield-core"><span class="shield-depth"></span>');
    expect(clientSource).toContain('class="fire-falcon-flight"');
    expect(clientSource).toContain('class="fire-wing fire-wing-left"');
    expect(clientSource).toContain('class="fire-wing fire-wing-right"');
    expect(clientSource).toContain('class="shield-outline"');
  });

  it("provides cyber-green depth motion and a reduced-motion fallback", () => {
    expect(styleSource).toContain(".shield-core{position:relative;transform-style:preserve-3d");
    expect(styleSource).toContain("@keyframes fireFalconApproach");
    expect(styleSource).toContain("@keyframes fireWingBeat");
    expect(styleSource).toContain("@keyframes fireTrailPulse");
    expect(styleSource).toContain("@media(prefers-reduced-motion:reduce)");
  });
});
