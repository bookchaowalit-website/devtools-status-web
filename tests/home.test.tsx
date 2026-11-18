import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

const html = () => renderToString(<Home />).replace(/<!-- -->/g, "");

describe("status page", () => {
  it("asks one question and says the data is a sample", () => {
    const page = html();
    expect(page).toContain("<h1>Service status</h1>");
    expect(page).toContain("Sample data");
    expect(page).toContain("not a live probe");
    expect(page).toContain("no notification channel is connected");
  });

  it("summarises the services the list shows", () => {
    const page = html();
    expect(page).toContain('<span class="ds-stat-value">Monitoring</span><span class="ds-stat-note">1 service under watch</span>');
    expect(page).toContain('<span class="ds-stat-value">2 / 3</span>');
    expect(page).toContain('<span class="ds-stat-value">0</span>');
  });

  it("lists every service with its state in words, not only colour", () => {
    const page = html();
    // Keeps its list role in Safari/VoiceOver even though the rows drop the bullets.
    expect(page).toContain('<ul class="ds-rows" role="list">');
    for (const name of ["Website", "API", "Job queue"]) expect(page).toContain(`aria-hidden="true"></span>${name}</span>`);
    expect(page.match(/data-tone="green">Operational</g)).toHaveLength(2);
    expect(page.match(/data-tone="amber">Monitoring</g)).toHaveLength(1);
    expect(page).toContain("99.7% uptime · sample advisory");
    expect(page).toContain("No open incidents");
    expect(page).toContain("Job queue: monitoring");
  });
});
