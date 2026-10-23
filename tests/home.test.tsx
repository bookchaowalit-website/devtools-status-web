import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

function rows(html: string) {
  return [...html.matchAll(/<div[^>]*role="row"[^>]*>(.*?)<\/div>(?=<div[^>]*role="row"|<\/div>)/g)].map((m) => m[1]);
}

describe("home page", () => {
  it("renders every sample service and the no-live-monitoring notice", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("Know what is holding.");
    for (const name of ["Website", "API", "Job queue"]) expect(html).toContain(name);
    expect(html).toContain("NO LIVE MONITORING");
    expect(html).toContain("authored sample values, not a live probe");
  });

  it("gives every child of an ARIA table row a header or cell role (axe aria-required-children)", () => {
    const html = renderToString(<Home />);
    const found = rows(html);
    expect(found.length).toBe(4);
    for (const row of found) {
      const children = [...row.matchAll(/<(span|strong)\b([^>]*)>/g)].filter((m) => !m[0].includes("<i"));
      const top = children.filter((m) => /role="(columnheader|rowheader|cell)"/.test(m[2]));
      expect(top.length, row).toBe(3);
    }
  });
});
