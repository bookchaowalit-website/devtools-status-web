import { DashFoot, DashTop, Pill, Stat, type Tone } from "@/components/dashboard-shell";
import { SERVICES, summarize, type ServiceState } from "@/lib/status";

const STATE: Record<ServiceState, { label: string; tone: Tone; dot: string }> = {
  operational: { label: "Operational", tone: "green", dot: "green" },
  monitoring: { label: "Monitoring", tone: "amber", dot: "amber" },
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
            <p>Uptime per service, authored values <Pill tone="grey">Sample data</Pill></p>
          </div>
        </div>

        <ul className="ds-stats" aria-label="Status at a glance">
          <Stat label="Overall" value={overall} note={monitoring ? `${monitoring} service under watch` : "every service responding"} />
          <Stat label="Operational" value={`${operational} / ${total}`} note="services" />
          <Stat label="Open incidents" value={0} note="in this sample" />
        </ul>

        <div className="ds-grid">
          <section className="ds-panel" aria-labelledby="services-heading">
            <div className="ds-panel-head">
              <div>
                <h2 id="services-heading">Services</h2>
                <p>Name, state and uptime</p>
              </div>
            </div>
            <ul className="ds-rows">
              {SERVICES.map((service) => (
                <li key={service.id} className="ds-row">
                  <span className="ds-row-name"><span className="ds-dot" data-tone={STATE[service.status].dot} aria-hidden="true" />{service.name}</span>
                  <span className="ds-row-detail">{service.uptime} uptime · {service.note}</span>
                  <span className="ds-row-value"><Pill tone={STATE[service.status].tone}>{STATE[service.status].label}</Pill></span>
                </li>
              ))}
            </ul>
          </section>

          <section className="ds-panel" aria-labelledby="incidents-heading">
            <div className="ds-panel-head">
              <div>
                <h2 id="incidents-heading">Incidents</h2>
                <p>Open now</p>
              </div>
            </div>
            <div className="ds-callout">
              <strong>No open incidents</strong>
              <span>Nothing is down in this sample.</span>
            </div>
            {watched.map((service) => (
              <div className="ds-callout" key={service.id}>
                <strong>{service.name}: monitoring</strong>
                <span>Shown as a sample advisory, so the page can show a state that is not green without inventing an incident.</span>
              </div>
            ))}
          </section>
        </div>

        <p className="ds-note">Numbers are authored sample values, not a live probe. No monitoring runs behind this page and no notification channel is connected.</p>
      </main>

      <DashFoot source="https://github.com/bookchaowalit-website/devtools-status-web" />
    </div>
  );
}
