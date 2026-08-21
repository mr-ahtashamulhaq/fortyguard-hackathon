import { AppShell } from "@/components/AppShell";
import { evidence, temperatures } from "@/lib/demo-data";
import { ArrowLeft, Bot, Database, FileCheck2, ShieldCheck } from "lucide-react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";

type EvidenceReading = { observedAt: string; temperatureC: number };
type EvidenceDisplay = { field: { name: string; farm?: string; hectares?: number; stage?: string; cropStage?: string }; policy: string; evaluation: { thresholdC?: number; longestExposureHours: number; heatScore: number; payoutBand: string; simulatedAmount: number; qualifyingReadings?: EvidenceReading[]; policySnapshot?: { version?: string; thresholdC?: number } } };

export default function Evidence() {
  const { recordCode = "DEMO-042" } = useParams<{ recordCode: string }>();
  const { data: storedRecord, isLoading } = trpc.agriGuard.evidence.useQuery({ recordCode });
  if (isLoading && recordCode !== "DEMO-042") {
    return <AppShell sourceLabel="Loading verified evidence"><div className="app-page evidence-page"><p className="app-eyebrow">Evidence record</p><h1>Loading verified field evidence.</h1><p>Retrieving the stored FortyGuard observations and deterministic policy result.</p></div></AppShell>;
  }
  const report = storedRecord?.report as EvidenceDisplay | undefined;
  const storedExplanation = storedRecord?.agent_explanation ? JSON.parse(storedRecord.agent_explanation) as { summary?: string; reasons?: string[] } : null;
  const record: EvidenceDisplay = report ?? { field: evidence.field, policy: evidence.policy, evaluation: { thresholdC: 34, longestExposureHours: 5, heatScore: 11.8, payoutBand: "50_percent", simulatedAmount: 12500, qualifyingReadings: temperatures.filter((item) => item.qualifying).map((item) => ({ observedAt: `2026-08-20T${item.hour}:00:00.000Z`, temperatureC: item.temp })), policySnapshot: { version: evidence.policy } } };
  const evaluation = record.evaluation;
  const qualifyingReadings: EvidenceReading[] = evaluation.qualifyingReadings ?? temperatures.filter((item) => item.qualifying).map((item) => ({ observedAt: `2026-08-20T${item.hour}:00:00.000Z`, temperatureC: item.temp }));
  const payoutBand = evaluation.payoutBand === "50_percent" ? "50%" : evaluation.payoutBand === "25_percent" ? "25%" : evaluation.payoutBand === "100_percent" ? "100%" : "No payout";
  const generatedAt = storedRecord?.created_at ? new Date(storedRecord.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : evidence.generatedAt;
  const isFortyGuard = storedRecord?.record_code?.startsWith("LIVE-") ?? false;
  const sourceLabel = isFortyGuard ? "Verified FortyGuard data" : "Synthetic demo data";
  const explanationSummary = storedExplanation?.summary?.replace(/\bnorth\b/gi, record.field.name) ?? "The deterministic policy evaluates the stored observations. The monitoring agent explains the result but cannot change the threshold, exposure rule, or payout band.";
  return (
    <AppShell sourceLabel={sourceLabel}>
      <div className="app-page evidence-page">
        <Link href="/app/fields/north" className="back-link"><ArrowLeft size={16} /> Field detail</Link>
        <div className="evidence-record-head"><div><p className="app-eyebrow">Evidence record / {storedRecord?.record_code ?? evidence.id}</p><h1>Heat event, shown in full.</h1><p>Generated {generatedAt} · <span className="synthetic-inline">{sourceLabel}</span></p></div><FileCheck2 size={42} strokeWidth={1.1} /></div>
        <section className="record-sheet-app"><div className="record-sheet-bar"><span>{evaluation.policySnapshot?.version ?? record.policy}</span><span>Policy result stored</span></div><div className="record-sheet-main"><div className="record-field-title"><span>Field</span><h2>{record.field.name}</h2><p>{record.field.farm ?? "Public field"} · {record.field.hectares ?? 42} hectares</p></div><div className="result-block"><span>Simulated decision</span><strong>{payoutBand}</strong><p>${Number(evaluation.simulatedAmount).toLocaleString()} simulated</p></div></div><div className="record-metric-grid"><div><small>Threshold</small><strong>{evaluation.policySnapshot?.thresholdC ?? evaluation.thresholdC ?? 34} °C</strong></div><div><small>Exposure</small><strong>{String(evaluation.longestExposureHours).padStart(2, "0")} continuous hours</strong></div><div><small>Heat score</small><strong>{evaluation.heatScore} degree-hours</strong></div><div><small>Crop stage</small><strong>{record.field.cropStage ?? record.field.stage}</strong></div></div><div className="observation-strip"><div className="observation-heading"><Database size={16} /><span>Qualifying observations</span><small>Source: {sourceLabel}</small></div><div className="observation-cells">{qualifyingReadings.map((item: EvidenceReading) => <div key={item.observedAt}><span>{new Date(item.observedAt).toISOString().slice(11, 16)}</span><strong>{item.temperatureC}°</strong></div>)}</div></div><div className="agent-explanation"><div className="agent-icon"><Bot size={18} /></div><div><span>Agent explanation</span><p>{explanationSummary}</p></div></div><div className="audit-line"><ShieldCheck size={15} /> Rule, source, timestamps, and simulated decision are recorded for review.</div></section>
      </div>
    </AppShell>
  );
}
