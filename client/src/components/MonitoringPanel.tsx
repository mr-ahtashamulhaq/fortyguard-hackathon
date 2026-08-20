import { useMonitoring, type MonitoringStage } from "@/contexts/MonitoringContext";
import { ArrowUpRight, Check, X } from "lucide-react";
import { Link } from "wouter";

const stageCopy: Record<Exclude<MonitoringStage, "idle">, { label: string; detail: string }> = {
  collecting: { label: "Collecting field observations", detail: "Loading the fixed synthetic heat-wave readings for North Field." },
  evaluating: { label: "Applying deterministic policy", detail: "Checking the 34 °C threshold, continuous exposure, and crop stage." },
  recording: { label: "Creating evidence record", detail: "Saving the observed readings, rule result, and structured explanation." },
  done: { label: "Evidence record ready", detail: "A 50% simulated payout band is ready for human review. No money has moved." },
  error: { label: "Monitoring run needs attention", detail: "The synthetic scenario could not be saved. You can close this panel and run it again without creating a duplicate payout." },
};

function AgentOrb({ stage }: { stage: MonitoringStage }) {
  return <div className={`monitor-orb ${stage}`} aria-hidden="true"><span className="orb-eye left" /><span className="orb-eye right" /><span className="orb-mouth" /></div>;
}

function LoaderGrid() {
  return <div className="monitor-grid-loader" role="status" aria-label="AgriGuard is processing the monitoring run"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>;
}

export function MonitoringPanel() {
  const { stage, closeMonitor, evidenceCode } = useMonitoring();
  if (stage === "idle") return null;
  const current = stageCopy[stage];
  const completed = stage === "done";

  return (
    <div className="monitor-overlay" role="dialog" aria-modal="true" aria-labelledby="monitor-title">
      <div className="monitor-card">
        <button className="monitor-close" onClick={closeMonitor} aria-label="Close monitoring panel"><X size={18} /></button>
        <div className="monitor-agent"><AgentOrb stage={stage} /><div><span>AgriGuard monitoring agent</span><small>{completed ? "Completed safely" : "Controlled demo run"}</small></div></div>
        <div className="monitor-copy"><p className="app-eyebrow">Synthetic heat-wave scenario</p><h2 id="monitor-title">{current.label}</h2><p>{current.detail}</p></div>
        {!completed ? <LoaderGrid /> : <div className="monitor-complete"><span><Check size={17} strokeWidth={1.9} /></span><p>Rule, source, timestamps, and simulated decision were recorded together.</p></div>}
        <div className="monitor-steps"><span className={stage === "collecting" ? "active" : "complete"}>1. Observe</span><span className={stage === "evaluating" ? "active" : stage === "recording" || completed ? "complete" : ""}>2. Apply</span><span className={stage === "recording" ? "active" : completed ? "complete" : ""}>3. Record</span></div>
        {completed ? <Link href={`/app/evidence/${evidenceCode.toLowerCase()}`} className="monitor-open-record" onClick={closeMonitor}>Inspect evidence record <ArrowUpRight size={16} /></Link> : null}
      </div>
    </div>
  );
}
