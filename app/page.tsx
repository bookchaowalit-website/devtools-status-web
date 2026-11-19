import { DashFoot, DashTop, Pill, Stat, type Tone } from "@/components/dashboard-shell";
import { SAMPLE, SERVICES, UPTIME_WINDOW, WINDOW_LABEL, formatUpdated, summarize, type ServiceState } from "@/lib/status";

const STATE: Record<ServiceState, { label: string; tone: Tone }> = {
  operational: { label: "Operational", tone: "green" },
  monitoring: { label: "Monitoring", tone: "amber" },
};

export default function Home() {
  const { operational, total, monitoring } = summarize(SERVICES);
  const watched = SERVICES.filter((service) => service.status === "monitoring");
  const overall = monitoring ? "Monitoring" : "Operational";

  return (
    <div className="ds">
      <a className="ds-skip" href="#main">Skip to content</a>
      <DashTop name="Status" tagline="Three sample services" />

      <main id="main" tabIndex={-1} className="ds-main">
        <div className="ds-head">
          <div>
            <h1>Service status</h1>
            <p>
              Uptime over the {WINDOW_LABEL[UPTIME_WINDOW]}, authored values · Updated{" "}
              <time dateTime={SAMPLE.updatedAt}>{formatUpdated(SAMPLE.updatedAt)}</time> <Pill tone="grey">Sample data</Pill>
            </p>
          </div>
        </div>

        <ul className="ds-stats" aria-label="Status at a glance">
          <Stat
            label="Overall"
            value={overall}
            tone={monitoring ? "amber" : undefined}
            note={monitoring ? `${monitoring} service under watch` : "every service responding"}
          />
          <Stat label="Operational" value={`${operational} / ${total}`} note="services" />
          <Stat label="Open incidents" value={0} note="in this sample" />
        </ul>

        <div className="ds-grid">
          <section className="ds-panel" aria-labelledby="services-heading">
            <div className="ds-panel-head">
              <div>
                <h2 id="services-heading">Services</h2>
                <p>Name, state and {UPTIME_WINDOW} uptime</p>
              </div>
            </div>
            {/* A real table (row headers, column headers, cells), so screen reader table commands can compare state and
                uptime across services; the scroll wrapper keeps large text from pushing the page sideways. */}
            <div className="status-table-wrap" role="region" aria-labelledby="services-heading" tabIndex={0}>
              <table className="ds-table status-table">
                <thead>
                  <tr>
                    <th scope="col">Service</th>
                    <th scope="col">State</th>
                    <th scope="col">Uptime ({UPTIME_WINDOW})</th>
                  </tr>
                </thead>
                <tbody>
                  {SERVICES.map((service) => (
                    <tr key={service.id}>
                      <th scope="row">
                        <span className="status-name"><span className="ds-dot" data-tone={STATE[service.status].tone} aria-hidden="true" />{service.name}</span>
                        <span className="status-note">{service.note}</span>
                      </th>
                      <td><Pill tone={STATE[service.status].tone}>{STATE[service.status].label}</Pill></td>
                      <td>{service.uptime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="ds-panel" aria-labelledby="incidents-heading">
            <div className="ds-panel-head">
              <div>
                <h2 id="incidents-heading">Incidents</h2>
                <p>Advisories first, then outages</p>
              </div>
            </div>
            {/* The advisory leads, with an amber dot and pill, so it never reads like the all-clear below it. */}
            {watched.map((service) => (
              <div className="ds-callout" key={service.id}>
                <strong>
                  <span className="ds-dot" data-tone="amber" aria-hidden="true" />
                  {service.name}: monitoring <Pill tone="amber">Advisory</Pill>
                </strong>
                <span>Shown as a sample advisory, so the page can show a state that is not green without inventing an incident.</span>
              </div>
            ))}
            <div className="ds-callout">
              <strong>
                <span className="ds-dot" data-tone="green" aria-hidden="true" />
                No outages
              </strong>
              <span>No open incidents: nothing is down in this sample.</span>
            </div>
          </section>
        </div>

        <p className="ds-note">Numbers are authored sample values, not a live probe. &quot;Updated&quot; is when the sample was last edited. No monitoring runs behind this page and no notification channel is connected.</p>
      </main>

      <DashFoot source="https://github.com/bookchaowalit-website/devtools-status-web" />
    </div>
  );
}
