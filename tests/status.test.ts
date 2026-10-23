import { describe, expect, it } from "vitest";
import { SERVICES, WINDOWS, searchServices, summarize, type Service } from "@/lib/status";

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

  it("offers the three time windows the page toggles", () => {
    expect(WINDOWS).toEqual(["24h", "7d", "30d"]);
  });
});
