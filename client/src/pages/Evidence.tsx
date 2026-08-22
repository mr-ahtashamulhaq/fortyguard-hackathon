import { AppShell } from "@/components/AppShell";
import { evidence, temperatures } from "@/lib/demo-data";
import { ArrowLeft, ArrowRight, Bot, Database, FileCheck2, ShieldCheck, ThermometerSun, Wheat } from "lucide-react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { getDecisionFacts, getEvidenceRouteState } from "@/lib/evidence-decision";

type EvidenceReading = { observedAt: string; temperatureC: number };
type EvidenceDisplay = { field: { name: string; farm?: string; hectares?: number; stage?: string; cropStage?: string }; policy: string; evaluation: { thresholdC?: number; longestExposureHours: number; heatScore: number; payoutBand: string; simulatedAmount: number; qualifyingReadings?: EvidenceReading[]; policySnapshot?: { version?: string; thresholdC?: number } } };

export default function Evidence() {
  const { recordCode = "DEMO-042" } = useParams<{ recordCode: string }>();
  const { data: storedRecord, isLoading, isError } = trpc.agriGuard.evidence.useQuery({ recordCode });
  const routeState = getEvidenceRouteState({ recordCode, isLoading, isError, hasReport: Boolean(storedRecord?.report) });
  if (routeState === "loading") {
    return <AppShell sourceLabel="Loading verified evidence"><div className="app-page evidence-page"><p className="app-eyebrow">Evidence record</p><h1>Loading verified field evidence.</h1><p>Retrieving the stored FortyGuard observations and deterministic policy result.</p></div></AppShell>;
  }
  if (routeState === "unavailable") {
    const problemCopy = isError ? "The verified evidence record could not be retrieved. No policy result is shown." : "This verified evidence record was not found. No policy result is shown.";
    return <AppShell sourceLabel="Verified evidence unavailable"><div className="app-page evidence-page evidence-state"><p className="app-eyebrow">Evidence record</p><h1>Verified evidence is unavailable.</h1><p>{problemCopy}</p><Link href="/app/portfolio" className="evidence-state-link">Return to portfolio</Link></div></AppShell>;
  }
  const report = storedRecord?.report as EvidenceDisplay | undefined;
  const storedExplanation = storedRecord?.agent_explanation ? JSON.parse(storedRecord.agent_explanation) as { summary?: string; reasons?: string[] } : null;
  const record: EvidenceDisplay = report ?? { field: evidence.field, policy: evidence.policy, evaluation: { thresholdC: 34, longestExposureHours: 5, heatScore: 11.8, payoutBand: "50_percent", simulatedAmount: 12500, qualifyingReadings: temperatures.filter((item) => item.qualifying).map((item) => ({ observedAt: `2026-08-20T${item.hour}:00:00.000Z`, temperatureC: item.temp })), policySnapshot: { version: evidence.policy } } };
  const evaluation = record.evaluation;
  const qualifyingReadings: EvidenceReading[] = evaluation.qualifyingReadings ?? temperatures.filter((item) => item.qualifying).map((item) => ({ observedAt: `2026-08-20T${item.hour}:00:00.000Z`, temperatureC: item.temp }));
  const payoutBand = evaluation.payoutBand === "50_percent" ? "50%" : evaluation.payoutBand === "25_percent" ? "25%" : evaluation.payoutBand === "100_percent" ? "100%" : "No payout";
  const thresholdC = evaluation.policySnapshot?.thresholdC ?? evaluation.thresholdC ?? 34;
  const decisionFacts = getDecisionFacts(qualifyingReadings);
  const generatedAt = storedRecord?.created_at ? new Date(storedRecord.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : evidence.generatedAt;
  const isFortyGuard = storedRecord?.record_code?.startsWith("LIVE-") ?? false;
  const sourceLabel = isFortyGuard ? "Verified FortyGuard data" : "Synthetic demo data";
  const explanationSummary = storedExplanation?.summary?.replace(/\bnorth\b/gi, record.field.name) ?? "The deterministic policy evaluates the stored observations. The monitoring agent explains the result but cannot change the threshold, exposure rule, or payout band.";
  return (
    <AppShell sourceLabel={sourceLabel}>
      <div className="app-page evidence-page">
        <Link href="/app/fields/north" className="back-link"><ArrowLeft size={16} /> Field detail</Link>
        <div className="evidence-record-head"><div><p className="app-eyebrow">Evidence record / {storedRecord?.record_code ?? evidence.id}</p><h1>Heat event, shown in full.</h1><p>Generated {generatedAt} · <span className="synthetic-inline">{sourceLabel}</span></p></div><FileCheck2 size={42} strokeWidth={1.1} /></div>
        <section className="record-sheet-app"><div className="record-sheet-bar"><span>{evaluation.policySnapshot?.version ?? record.policy}</span><span>Policy result stored</span></div><div className="record-sheet-main"><div className="record-field-title"><span>Field</span><h2>{record.field.name}</h2><p>{record.field.farm ?? "Public field"} · {record.field.hectares ?? 42} hectares</p></div><div className="result-block"><span>Simulated decision</span><strong>{payoutBand}</strong><p>${Number(evaluation.simulatedAmount).toLocaleString()} simulated</p></div></div><div className="record-metric-grid"><div><small>Threshold</small><strong>{thresholdC} °C</strong></div><div><small>Exposure</small><strong>{String(evaluation.longestExposureHours).padStart(2, "0")} continuous hours</strong></div><div><small>Heat score</small><strong>{evaluation.heatScore} degree-hours</strong></div><div><small>Crop stage</small><strong>{record.field.cropStage ?? record.field.stage}</strong></div></div><section className="decision-chain" aria-label="Why this simulated decision was recorded"><div className="decision-chain-heading"><ShieldCheck size={16} /><span>Why this decision</span><small>Deterministic policy engine</small></div><div className="decision-chain-flow"><div className="decision-chain-step observed"><ThermometerSun size={18} /><div><small>Observed</small><strong>{decisionFacts.continuousHours} continuous hours above {thresholdC} °C</strong><p>Peak {decisionFacts.peakTemperature?.toFixed(1) ?? "—"} °C · {sourceLabel}</p></div></div><ArrowRight className="decision-chain-arrow" size={18} aria-hidden="true" /><div className="decision-chain-step rule"><Wheat size={18} /><div><small>Applied</small><strong>{record.field.cropStage ?? record.field.stage} stage is eligible</strong><p>Rule requires at least 3 continuous hours at or above {thresholdC} °C.</p></div></div><ArrowRight className="decision-chain-arrow" size={18} aria-hidden="true" /><div className="decision-chain-step result"><FileCheck2 size={18} /><div><small>Recorded</small><strong>{payoutBand} simulated payout band</strong><p>Agent records and explains; it cannot change the policy result.</p></div></div></div></section><div className="observation-strip"><div className="observation-heading"><Database size={16} /><span>Qualifying observations</span><small>Source: {sourceLabel}</small></div><div className="observation-cells">{qualifyingReadings.map((item: EvidenceReading) => <div key={item.observedAt}><span>{new Date(item.observedAt).toISOString().slice(11, 16)}</span><strong>{item.temperatureC}°</strong></div>)}</div></div><div className="agent-explanation"><div className="agent-icon"><Bot size={18} /></div><div><span>Agent explanation</span><p>{explanationSummary}</p></div></div><div className="audit-line"><ShieldCheck size={15} /> Rule, source, timestamps, and simulated decision are recorded for review.</div></section>
      </div>
    </AppShell>
  );
}
