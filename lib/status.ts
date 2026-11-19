// Authored sample services for the status page and the MCP route. Not a live probe.

export type ServiceState = "operational" | "monitoring";
export type Service = { id: string; name: string; status: ServiceState; uptime: string; note: string };

/**
 * The sample and the time its values were last edited (UTC), kept together: the page's "Updated" label reads `updatedAt`
 * from here. Whoever edits `services` sets `updatedAt` to that moment; tests/status.test.ts pins a fingerprint of the
 * services so an edit without a new time fails. (Values last changed in d55b88c, 2026-10-23 12:30:59 +07:00.)
 */
export const SAMPLE: { readonly updatedAt: string; readonly services: readonly Service[] } = {
  updatedAt: "2026-10-23T05:30:59Z",
  services: [
    { id: "website", name: "Website", status: "operational", uptime: "99.9%", note: "responding" },
    { id: "api", name: "API", status: "operational", uptime: "99.8%", note: "responding" },
    { id: "job-queue", name: "Job queue", status: "monitoring", uptime: "99.7%", note: "sample advisory" },
  ],
};

export const SERVICES: readonly Service[] = SAMPLE.services;

export const WINDOWS = ["24h", "7d", "30d"] as const;
export type StatusWindow = (typeof WINDOWS)[number];

/** The window every sample uptime figure covers, said on the page so "99.9%" has a period. */
export const UPTIME_WINDOW: StatusWindow = "30d";
export const WINDOW_LABEL: Record<StatusWindow, string> = { "24h": "last 24 hours", "7d": "last 7 days", "30d": "last 30 days" };


const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "19 Nov 2026, 09:00 UTC": fixed to UTC so the server and the browser print the same text. */
export function formatUpdated(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

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
