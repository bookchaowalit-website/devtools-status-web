import { describe, expect, it } from "vitest";
import { SERVICES, UPTIME_WINDOW, WINDOWS, WINDOW_LABEL, formatUpdated, searchServices, summarize, type Service } from "@/lib/status";

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
