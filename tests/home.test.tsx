// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Home from "@/app/page";
import nextConfig from "@/next.config";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let host: HTMLDivElement;

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  act(() => root.render(<Home />));
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, " ").trim() ?? "";

describe("status page", () => {
  it("asks one question and says the data is a sample, its window and when it was updated", () => {
    expect(text(host.querySelector("h1"))).toBe("Service status");
    const head = text(host.querySelector(".ds-head p"));
    expect(head).toContain("Uptime over the last 30 days");
    // The label reads the sample's own edit time, not a hard-coded string.
    expect(head).toContain("Updated 23 Oct 2026, 05:30 UTC");
    expect(head).toContain("Sample data");
    expect(host.querySelector(".ds-head time")?.getAttribute("datetime")).toBe("2026-10-23T05:30:59Z");
    const note = text(host.querySelector(".ds-note"));
    expect(note).toContain("not a live probe");
    expect(note).toContain("no notification channel is connected");
  });

  it("summarises the services the list shows, with a tone on the overall tile", () => {
    const stats = [...host.querySelectorAll(".ds-stat")];
    expect(stats.map((s) => text(s.querySelector(".ds-stat-value")))).toEqual(["Monitoring", "2 / 3", "0"]);
    expect(text(stats[0].querySelector(".ds-stat-note"))).toBe("1 service under watch");
    expect(stats[0].getAttribute("data-tone")).toBe("amber");
    expect(stats[1].hasAttribute("data-tone")).toBe(false);
  });

  it("lists every service with its state in words and the uptime window", () => {
    const list = host.querySelector(".ds-rows");
    // Keeps its list role in Safari/VoiceOver even though the rows drop the bullets.
    expect(list?.getAttribute("role")).toBe("list");
    expect(list?.classList.contains("status-rows")).toBe(true);
    const rows = [...host.querySelectorAll(".ds-row")];
    expect(rows.map((r) => text(r.querySelector(".ds-row-name")))).toEqual(["Website", "API", "Job queue"]);
    expect(rows.map((r) => text(r.querySelector(".ds-row-value")))).toEqual(["Operational", "Operational", "Monitoring"]);
    expect(text(rows[2].querySelector(".ds-row-detail"))).toBe("99.7% uptime (30d) · sample advisory");
    expect(rows[2].querySelector(".ds-pill")?.getAttribute("data-tone")).toBe("amber");
  });

  it("puts the advisory first and styles it apart from the all-clear", () => {
    const callouts = [...host.querySelectorAll(".ds-callout")];
    expect(callouts).toHaveLength(2);
    expect(text(callouts[0].querySelector("strong"))).toBe("Job queue: monitoring Advisory");
    expect(callouts[0].querySelector(".ds-dot")?.getAttribute("data-tone")).toBe("amber");
    expect(callouts[0].querySelector(".ds-pill")?.getAttribute("data-tone")).toBe("amber");
    expect(text(callouts[1].querySelector("strong"))).toBe("No outages");
    expect(callouts[1].querySelector(".ds-dot")?.getAttribute("data-tone")).toBe("green");
    expect(text(callouts[1])).toContain("No open incidents");
  });

  it("links home in the footer", () => {
    const links = [...host.querySelectorAll("footer a")].map((a) => a.getAttribute("href"));
    expect(links).toContain("https://bookchaowalit.com/");
  });
});

describe("redirects", () => {
  it("sends the old /more-projects page to the portfolio hub with a 308", async () => {
    const rules = await nextConfig.redirects!();
    expect(rules).toContainEqual({ source: "/more-projects", destination: "https://bookchaowalit.com/", permanent: true });
  });
});
