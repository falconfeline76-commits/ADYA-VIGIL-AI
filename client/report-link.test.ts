import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const clientSource = readFileSync(resolve(process.cwd(), "client/src/main.js"), "utf8");
const reportUrl = "https://cybercrime.gov.in/Webform/Accept.aspx";
const navigationSource = clientSource.slice(
  clientSource.indexOf("function navigateToReport"),
  clientSource.indexOf("\nconst demoPreview"),
);

describe("Scan Center report action", () => {
  it("uses the official cybercrime reporting URL beside the analyze action", () => {
    expect(clientSource).toContain(`<div class="scan-action-buttons">`);
    expect(clientSource).toContain(`const REPORT_URL = "${reportUrl}";`);
    expect(clientSource).toContain(`id="report" type="button" class="button report"`);
    expect(clientSource).toContain("function navigateToReport()");
    expect(clientSource).toContain("window.top.location.assign(REPORT_URL)");
    expect(clientSource).toContain("reportButton.addEventListener(\"click\", navigateToReport)");
    expect(clientSource).toContain("REPORT");
  });

  it("assigns the official portal URL when the handler executes", () => {
    const createNavigateToReport = new Function(
      "window",
      `const REPORT_URL = ${JSON.stringify(reportUrl)}; ${navigationSource}; return navigateToReport;`,
    ) as (window: Window) => () => void;
    let assignedUrl = "";
    const mockWindow = {
      top: { location: { assign: (url: string) => { assignedUrl = url; } } },
      location: { assign: () => undefined },
    } as unknown as Window;

    const navigateToReport = createNavigateToReport(mockWindow);
    navigateToReport();
    expect(assignedUrl).toBe(reportUrl);
  });
});
