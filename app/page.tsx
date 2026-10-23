"use client";

import { useState } from "react";
import { SERVICES, WINDOWS, summarize, type StatusWindow } from "@/lib/status";

export default function Home() {
  const [range, setRange] = useState<StatusWindow>("7d");
  const { operational, total } = summarize(SERVICES);

  return (
    <main className="control-shell">
      <nav className="control-nav" aria-label="Control Room">
        <span className="control-mark">CONTROL / ROOM</span>
        <span>PUBLIC SNAPSHOT · SAMPLE DATA</span>
      </nav>

      <header className="control-hero">
        <div><h1>Know what is holding.</h1><p>A clear service status surface for the moments when a useful answer matters more than a decorative dashboard.</p></div>
        <div className="control-now"><span>NOW</span><strong>OK</strong><small>sample snapshot</small></div>
      </header>

      <section className="control-signal" aria-label="Overall status">
        <div><span>OVERALL</span><strong>Operational</strong></div>
        <div><span>SERVICES</span><strong>{operational} / {total}</strong></div>
        <div><span>INCIDENTS</span><strong>00</strong></div>
        <div className="control-range"><span>WINDOW</span><div>{WINDOWS.map((item) => <button key={item} type="button" aria-pressed={range === item} onClick={() => setRange(item)}>{item}</button>)}</div></div>
      </section>

      <section className="control-grid">
        <div className="control-panel control-services">
          <div className="control-panel-head"><span>A / SERVICE MATRIX</span><span>{range} view</span></div>
          <h2>Systems in view.</h2>
          <div className="control-table" role="table" aria-label="Service status">
            <div className="control-table-row control-table-labels" role="row"><span role="columnheader">NAME</span><span role="columnheader">UPTIME</span><span role="columnheader">STATE</span></div>
            {SERVICES.map((service) => <div className="control-table-row" role="row" key={service.id}><strong role="rowheader">{service.name}</strong><span role="cell">{service.uptime}</span><span role="cell" className={`control-state control-state-${service.status}`}><i aria-hidden="true" />{service.status}</span></div>)}
          </div>
          <p className="control-footnote">Numbers are authored sample values, not a live probe.</p>
        </div>

        <div className="control-panel control-incidents">
          <div className="control-panel-head"><span>B / INCIDENT LOG</span><span>00 open</span></div>
          <h2>Nothing active.</h2>
          <div className="control-clear-state"><span className="control-clear-code">OK</span><div><strong>All clear</strong><p>No active incidents in this sample window.</p></div></div>
          <div className="control-log-line"><span>LAST CHECK</span><strong>just now</strong></div>
          <div className="control-log-line"><span>DATA SOURCE</span><strong>local fixture</strong></div>
        </div>
      </section>

      <section className="control-advisory"><span className="control-advisory-label">ADVISORY / 01</span><p>The job queue carries a sample monitoring state so the interface can show a non-green status without inventing an active incident.</p><span className="control-advisory-state">MONITORING</span></section>

      <footer className="control-footer"><span>STATUS PAGE / HONEST DEMO</span><span>NO LIVE MONITORING · NO NOTIFICATION CHANNEL</span></footer>
    </main>
  );
}
