import { AppShell, RunMonitorButton } from "@/components/AppShell";
import { FieldMap } from "@/components/FieldMap";
import { fields } from "@/lib/demo-data";
import { useMonitoring } from "@/contexts/MonitoringContext";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, CloudSun, Database, MapPinned } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Portfolio() {
  const { startMonitoring, isRunning } = useMonitoring();
  const { data: portfolio } = trpc.agriGuard.portfolio.useQuery();
  const utils = trpc.useUtils();
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [liveEvidenceCode, setLiveEvidenceCode] = useState<string | null>(null);
  const liveMonitoring = trpc.agriGuard.runFortyGuardMonitoring.useMutation({
    onSuccess: async (result) => {
      await utils.agriGuard.portfolio.invalidate();
      setLiveEvidenceCode(result.evidenceCode ?? null);
      setLiveStatus(result.persisted ? "Verified FortyGuard observations were stored. The policy result remains simulated." : result.error ?? "FortyGuard did not return a complete hourly record.");
    },
    onError: () => setLiveStatus("The live FortyGuard request could not complete. The synthetic demo remains unchanged."),
  });
  const displayFields = portfolio?.fields ?? fields;
  const mapFields = portfolio?.source === "fortyguard" ? displayFields.filter((field) => field.id === "north") : displayFields;
  const evidenceCode = liveEvidenceCode ?? portfolio?.latestLiveEvidenceCode ?? null;
  const statusCount = (status: string) => displayFields.filter((field) => field.status === status).length;
  return (
    <AppShell action={<RunMonitorButton />} sourceLabel={portfolio?.source === "fortyguard" ? "FortyGuard data" : "Synthetic demo data"}>
      <div className="app-page portfolio-page">
        <div className="app-page-heading">
          <div><p className="app-eyebrow">Portfolio / 04 monitored fields</p><h1>Field conditions at a glance.</h1><p>Wheat heat-risk monitoring for a controlled, simulated policy workflow.</p></div>
          <div className="last-sync"><Database size={15} strokeWidth={1.5} /><span>{portfolio?.source === "fortyguard" ? "Last FortyGuard reading" : "Last synthetic update"}</span><strong>{portfolio?.lastReading ?? "11:00 UTC"}</strong></div>
        </div>
        <div className="portfolio-summary">
          <div><span>{statusCount("Triggered")}</span><small>Triggered</small></div><div><span>{statusCount("Watch")}</span><small>Watch</small></div><div><span>{statusCount("Safe")}</span><small>Safe</small></div><div><span>{statusCount("Data unavailable")}</span><small>Data unavailable</small></div>
        </div>
        <section className="map-register-grid">
          <div className="map-panel"><div className="panel-heading"><div><MapPinned size={17} strokeWidth={1.45} /><span>Field register map</span></div><small>{portfolio?.source === "fortyguard" ? "Fresno County, California" : "Synthetic demo region"}</small></div><FieldMap fields={mapFields} /></div>
          <div className="field-register"><div className="panel-heading"><div><CloudSun size={17} strokeWidth={1.45} /><span>Risk register</span></div><small>Live rules apply on demand</small></div><div className="field-list">{displayFields.map(field => <Link className="field-row" key={field.id} href={field.id === "north" ? "/app/fields/north" : "/app"}><span className={`field-status-dot ${field.status.toLowerCase().replaceAll(" ", "-")}`} /><div><strong>{field.name}</strong><small>{field.hectares} ha · {field.stage} · {field.source}</small></div><div className="field-reading">{field.peak ? <><strong>{field.peak}°</strong><small>{field.status}</small></> : <><strong>—</strong><small>Data unavailable</small></>}</div><ArrowUpRight size={15} strokeWidth={1.35} /></Link>)}</div></div>
        </section>
        <section className="portfolio-note"><span>Demo boundary</span><p>The judge-demo control stays synthetic. The separate FortyGuard action loads a verified three-hour historical window for a public Fresno County wheat field and keeps every resulting payout labelled simulated.</p><Link href={evidenceCode ? `/app/evidence/${evidenceCode}` : "/app/evidence/demo-042"}>{evidenceCode ? "Open verified evidence" : "Open example evidence"} <ArrowUpRight size={15} strokeWidth={1.4} /></Link></section>
        <section className="scenario-control"><div><p className="app-eyebrow">Judge demo control</p><h2>Run the five-hour heat-wave scenario.</h2><p>Loads the fixed synthetic readings, applies the policy, and opens the evidence handoff.</p></div><div className="scenario-control-actions"><button onClick={startMonitoring} disabled={isRunning || liveMonitoring.isPending}><span>Synthetic</span>{isRunning ? "Monitoring…" : "Run scenario"}<ArrowUpRight size={16} /></button><button className="live-monitor-button" onClick={() => { setLiveStatus("Loading the verified Fresno County historical temperature window…"); liveMonitoring.mutate(); }} disabled={isRunning || liveMonitoring.isPending}><span>FortyGuard</span>{liveMonitoring.isPending ? "Loading…" : "Load verified history"}<ArrowUpRight size={16} /></button>{liveStatus && <p className="live-monitor-status" role="status">{liveStatus}</p>}</div></section>
      </div>
    </AppShell>
  );
}
