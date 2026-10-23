// Authored sample services for the status page and the MCP route. Not a live probe.

export type ServiceState = "operational" | "monitoring";
export type Service = { id: string; name: string; status: ServiceState; uptime: string; note: string };

export const SERVICES: readonly Service[] = [
  { id: "website", name: "Website", status: "operational", uptime: "99.9%", note: "responding" },
  { id: "api", name: "API", status: "operational", uptime: "99.8%", note: "responding" },
  { id: "job-queue", name: "Job queue", status: "monitoring", uptime: "99.7%", note: "sample advisory" },
];

export const WINDOWS = ["24h", "7d", "30d"] as const;
export type StatusWindow = (typeof WINDOWS)[number];

export function summarize(services: readonly Service[]) {
  const operational = services.filter((service) => service.status === "operational").length;
  return { operational, total: services.length, monitoring: services.length - operational };
}

export function searchServices(services: readonly Service[], query: string): Service[] {
  const needle = query.trim().toLowerCase();
  return services.filter((service) =>
    [service.name, service.status, service.note].some((field) => field.toLowerCase().includes(needle)),
  );
}
