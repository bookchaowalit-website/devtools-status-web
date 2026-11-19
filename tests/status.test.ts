import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { SAMPLE, SERVICES, UPTIME_WINDOW, WINDOWS, WINDOW_LABEL, formatUpdated, searchServices, summarize, type Service } from "@/lib/status";

describe("sample edit time", () => {
  it("comes with the data and changes whenever the services change", () => {
    expect(SERVICES).toBe(SAMPLE.services);
    expect(new Date(SAMPLE.updatedAt).toISOString()).toBe("2026-08-24T12:03:53.000Z");
    // If this fails you edited the sample services: set SAMPLE.updatedAt to the time of that edit, then update the fingerprint.
    const fingerprint = createHash("sha256").update(JSON.stringify(SAMPLE.services)).digest("hex").slice(0, 16);
    expect({ fingerprint, updatedAt: SAMPLE.updatedAt }).toEqual({ fingerprint: "5e7a63f395204cf4", updatedAt: "2026-08-24T12:03:53Z" });
  });
});

describe("status logic", () => {
  it("counts operational and monitoring services", () => {
    expect(summarize(SERVICES)).toEqual({ operational: 2, total: 3, monitoring: 1 });
    expect(summarize([])).toEqual({ operational: 0, total: 0, monitoring: 0 });
  });

  it("service ids are unique and every state is one the page styles", () => {
    expect(new Set(SERVICES.map((s) => s.id)).size).toBe(SERVICES.length);
    for (const s of SERVICES) expect(["operational", "monitoring"]).toContain(s.status);
  });

  it("searches name, state and note case-insensitively", () => {
    expect(searchServices(SERVICES, "QUEUE").map((s) => s.id)).toEqual(["job-queue"]);
    expect(searchServices(SERVICES, "monitoring").map((s) => s.id)).toEqual(["job-queue"]);
    expect(searchServices(SERVICES, "responding").map((s) => s.id)).toEqual(["website", "api"]);
    expect(searchServices(SERVICES, "  ")).toHaveLength(3);
    expect(searchServices([] as Service[], "x")).toEqual([]);
  });

  it("knows the three uptime windows", () => {
    expect(WINDOWS).toEqual(["24h", "7d", "30d"]);
  });

  it("names the uptime window and prints the update time in UTC", () => {
    expect(UPTIME_WINDOW).toBe("30d");
    expect(WINDOW_LABEL[UPTIME_WINDOW]).toBe("last 30 days");
    expect(formatUpdated("2026-11-19T09:00:00Z")).toBe("19 Nov 2026, 09:00 UTC");
    expect(formatUpdated("2027-01-05T23:07:00Z")).toBe("5 Jan 2027, 23:07 UTC");
  });
});
