import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const clientSource = readFileSync(resolve(process.cwd(), "client/src/main.js"), "utf8");
const styleSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("3D falcon defense treatment", () => {
  it("renders the technological cybernetic falcon inside the shield", () => {
    expect(clientSource).toContain('class="fire-falcon-flight"><span class="falcon-signal-noise" aria-hidden="true"></span><span class="falcon-signal-scanline" aria-hidden="true"></span>');
    expect(clientSource).toContain('class="cyber-falcon-asset"');
    expect(clientSource).toContain('adya-cybernetic-falcon-cutout_1a566b1c.png');
    expect(clientSource).toContain('alt="Technological cybernetic falcon with glowing circuit patterns inside a cyber shield"');
    expect(clientSource).toContain('class="hex-shield-field"');
    expect(clientSource).toContain('class="hex-shield-frame"');
    expect(clientSource).toContain('class="button-icon"');
    expect(clientSource).toContain('New scan');
  });

  it("provides cyber-green circuit glow, depth motion, and a reduced-motion fallback", () => {
    expect(styleSource).toContain(".shield-core{position:relative;transform-style:preserve-3d");
    expect(styleSource).toContain("@keyframes realFalconFlight");
    expect(styleSource).toContain("@keyframes realFireWake");
    expect(styleSource).toContain(".brand-mark-3d{animation:none!important");
    expect(styleSource).toContain(".fire-falcon-flight{width:142px;height:142px");
    expect(styleSource).toContain(".fire-falcon-flight .cyber-falcon-asset");
    expect(styleSource).toContain("rgba(98,255,84,.78)");
    expect(styleSource).toContain(".hex-shield-field");
    expect(styleSource).toContain(".button-icon svg");
    expect(styleSource).toContain("@media(prefers-reduced-motion:reduce)");
    expect(styleSource).toContain(".falcon-signal-noise");
    expect(styleSource).toContain(".falcon-signal-scanline");
    expect(styleSource).toContain("@keyframes falconStaticNoise");
    expect(styleSource).toContain("@keyframes falconSignalScan");
    expect(styleSource).toContain("@keyframes falconSignalReveal");
    expect(styleSource).toContain("animation:falconStaticNoise 1.2s steps(1,end) both");
    expect(styleSource).toContain("animation:falconSignalScan 1.2s cubic-bezier(.77,0,.175,1) both");
    expect(styleSource).toContain("animation:realFalconFlight 4.2s ease-in-out infinite, falconSignalReveal 1.2s cubic-bezier(.23,1,.32,1) both");
    expect(styleSource).toContain("drop-shadow(0 0 18px rgba(61,224,255,.8))");
    expect(styleSource).toContain(".falcon-signal-noise,.falcon-signal-scanline{animation:none!important;opacity:0!important}");
  });
});
