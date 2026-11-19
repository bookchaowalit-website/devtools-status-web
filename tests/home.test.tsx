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
    expect(head).toContain("Updated 24 Aug 2026, 12:03 UTC");
    expect(head).toContain("Sample data");
    expect(host.querySelector(".ds-head time")?.getAttribute("datetime")).toBe("2026-08-24T12:03:53Z");
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

  it("lists every service in a real table, so screen readers can move by column", () => {
    const table = host.querySelector("table.status-table");
    expect(table).not.toBeNull();
    const region = table?.closest(".status-table-wrap");
    expect([region?.getAttribute("role"), region?.getAttribute("aria-labelledby"), region?.getAttribute("tabindex")]).toEqual(["region", "services-heading", "0"]);
    // Column headers name each column; every row is led by its service name as a row header.
    const cols = [...host.querySelectorAll("thead th")];
    expect(cols.map((th) => [text(th), th.getAttribute("scope")])).toEqual([["Service", "col"], ["State", "col"], ["Uptime (30d)", "col"]]);
    const rows = [...host.querySelectorAll("tbody tr")];
    expect(rows.map((r) => [r.querySelector("th")?.getAttribute("scope"), text(r.querySelector(".status-name"))])).toEqual([["row", "Website"], ["row", "API"], ["row", "Job queue"]]);
    expect(rows.map((r) => [...r.querySelectorAll("td")].map(text))).toEqual([["Operational", "99.9%"], ["Operational", "99.8%"], ["Monitoring", "99.7%"]]);
    expect(text(rows[2].querySelector(".status-note"))).toBe("sample advisory");
    expect(rows[2].querySelector(".ds-pill")?.getAttribute("data-tone")).toBe("amber");
    expect(rows[2].querySelector(".ds-dot")?.getAttribute("data-tone")).toBe("amber");
    expect(host.querySelector(".ds-rows")).toBeNull();
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
