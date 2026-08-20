import { AppShell, RunMonitorButton } from "@/components/AppShell";
import { FieldMap } from "@/components/FieldMap";
import { fields } from "@/lib/demo-data";
import { useMonitoring } from "@/contexts/MonitoringContext";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, CloudSun, Database, MapPinned } from "lucide-react";
import { Link } from "wouter";

export default function Portfolio() {
  const { startMonitoring, isRunning } = useMonitoring();
  const { data: portfolio } = trpc.agriGuard.portfolio.useQuery();
  const displayFields = portfolio?.fields ?? fields;
  const statusCount = (status: string) => displayFields.filter((field) => field.status === status).length;
  return (
    <AppShell action={<RunMonitorButton />}>
      <div className="app-page portfolio-page">
        <div className="app-page-heading">
          <div><p className="app-eyebrow">Portfolio / 04 monitored fields</p><h1>Field conditions at a glance.</h1><p>Wheat heat-risk monitoring for a controlled, simulated policy workflow.</p></div>
          <div className="last-sync"><Database size={15} strokeWidth={1.5} /><span>Last synthetic update</span><strong>11:00 UTC</strong></div>
        </div>
        <div className="portfolio-summary">
          <div><span>{statusCount("Triggered")}</span><small>Triggered</small></div><div><span>{statusCount("Watch")}</span><small>Watch</small></div><div><span>{statusCount("Safe")}</span><small>Safe</small></div><div><span>{statusCount("Data unavailable")}</span><small>Data unavailable</small></div>
        </div>
        <section className="map-register-grid">
          <div className="map-panel"><div className="panel-heading"><div><MapPinned size={17} strokeWidth={1.45} /><span>Field register map</span></div><small>Punjab demo region</small></div><FieldMap fields={displayFields} /></div>
          <div className="field-register"><div className="panel-heading"><div><CloudSun size={17} strokeWidth={1.45} /><span>Risk register</span></div><small>Live rules apply on demand</small></div><div className="field-list">{displayFields.map(field => <Link className="field-row" key={field.id} href={field.id === "north" ? "/app/fields/north" : "/app"}><span className={`field-status-dot ${field.status.toLowerCase().replaceAll(" ", "-")}`} /><div><strong>{field.name}</strong><small>{field.hectares} ha · {field.stage}</small></div><div className="field-reading">{field.peak ? <><strong>{field.peak}°</strong><small>{field.status}</small></> : <><strong>—</strong><small>Data unavailable</small></>}</div><ArrowUpRight size={15} strokeWidth={1.35} /></Link>)}</div></div>
        </section>
        <section className="portfolio-note"><span>Demo boundary</span><p>All readings, statuses, and payout paths are synthetic until FortyGuard API observations are connected.</p><Link href="/app/evidence/demo-042">Open example evidence <ArrowUpRight size={15} strokeWidth={1.4} /></Link></section>
        <section className="scenario-control"><div><p className="app-eyebrow">Judge demo control</p><h2>Run the five-hour heat-wave scenario.</h2><p>Loads the fixed North Field readings, applies the policy, and opens the evidence handoff.</p></div><button onClick={startMonitoring} disabled={isRunning}><span>North Field</span>{isRunning ? "Monitoring…" : "Run scenario"}<ArrowUpRight size={16} /></button></section>
      </div>
    </AppShell>
  );
}
