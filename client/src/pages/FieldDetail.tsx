import { AppShell, RunMonitorButton } from "@/components/AppShell";
import { evidence, heatScore, temperatures } from "@/lib/demo-data";
import { ArrowLeft, ArrowUpRight, CircleCheck, ThermometerSun } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const chartTooltip = { contentStyle: { background: "#10221d", border: "none", borderRadius: "12px", color: "#f1f5ee", fontSize: "12px" }, labelStyle: { color: "#a9d7b2" } };

export default function FieldDetail() {
  const { data: fieldDetail, isLoading } = trpc.agriGuard.fieldDetail.useQuery({ fieldId: "north" });
  if (isLoading) {
    return <AppShell action={<RunMonitorButton />} sourceLabel="Loading field data"><div className="app-page detail-page"><p className="app-eyebrow">Field detail</p><h1>Loading monitored field data.</h1><p>Retrieving the latest verified or synthetic observation set.</p></div></AppShell>;
  }
  const chartReadings = fieldDetail?.readings ?? temperatures.map((reading, index) => ({ ...reading, heatScore: heatScore[index]?.score ?? 0 }));
  const field = fieldDetail?.field ?? evidence.field;
  const evaluation = fieldDetail?.evaluation;
  const peak = Math.max(...chartReadings.map((reading) => reading.temp));
  const heatScoreValue = evaluation?.heatScore ?? heatScore.at(-1)?.score ?? 0;
  const exposure = evaluation?.longestExposureHours ?? 5;
  const status = field.status;
  const sourceLabel = fieldDetail?.source === "fortyguard" ? "FortyGuard data" : "Synthetic demo data";
  const lastObserved = fieldDetail?.lastObservedAt ? new Date(fieldDetail.lastObservedAt).toISOString().replace("T", " ").slice(0, 16) + " UTC" : "Demo observation window";
  return (
    <AppShell action={<RunMonitorButton />} sourceLabel={sourceLabel}>
      <div className="app-page detail-page">
        <Link href="/app" className="back-link"><ArrowLeft size={16} strokeWidth={1.5} /> Portfolio</Link>
        <div className="detail-heading"><div><p className="app-eyebrow">{field.name} / {field.farm}</p><h1>Heat event detail</h1><p>{field.stage} · {field.hectares} hectares · <span className="status-triggered">{status}</span></p></div><div className="detail-source"><span>{field.source}</span><small>Hourly temperature observations · {lastObserved}</small></div></div>
        <section className="chart-panel"><div className="chart-panel-heading"><div><ThermometerSun size={18} strokeWidth={1.45} /><div><span>Temperature profile</span><small>Threshold is 34 °C</small></div></div><strong>{peak.toFixed(1)} °C peak</strong></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartReadings} margin={{ top: 15, right: 10, bottom: 0, left: -24 }}><CartesianGrid vertical={false} stroke="rgba(46,107,85,.16)" /><XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fill: "#61766c", fontSize: 11 }} tickFormatter={value => `${value}:00`} /><YAxis domain={[24, 40]} tickLine={false} axisLine={false} tick={{ fill: "#61766c", fontSize: 11 }} unit="°" /><Tooltip {...chartTooltip} formatter={value => [`${value} °C`, "Temperature"]} labelFormatter={value => `${value}:00 UTC`} /><ReferenceLine y={34} stroke="#c85a2b" strokeDasharray="4 4" label={{ value: "34° policy threshold", position: "insideTopRight", fill: "#c85a2b", fontSize: 10 }} /><Line type="monotone" dataKey="temp" stroke="#2b7daa" strokeWidth={3} isAnimationActive={false} connectNulls dot={({ cx, cy, payload }) => <circle key={`${payload.hour}-${payload.temp}`} cx={cx} cy={cy} r={payload.qualifying ? 5 : 3.5} fill={payload.qualifying ? "#c85a2b" : "#2b7daa"} stroke="#f9fbf5" strokeWidth={2} />} /></LineChart></ResponsiveContainer></div></section>
        <section className="detail-lower-grid"><div className="chart-panel compact"><div className="chart-panel-heading"><div><CircleCheck size={18} strokeWidth={1.45} /><div><span>Heat score</span><small>Degree-hours above threshold</small></div></div><strong>{heatScoreValue.toFixed(1)}</strong></div><div className="chart-area small"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartReadings} margin={{ top: 15, right: 8, bottom: 0, left: -24 }}><defs><linearGradient id="heatScore" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#c85a2b" stopOpacity={.5}/><stop offset="100%" stopColor="#c85a2b" stopOpacity={.03}/></linearGradient></defs><CartesianGrid vertical={false} stroke="rgba(46,107,85,.16)" /><XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fill: "#61766c", fontSize: 10 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: "#61766c", fontSize: 10 }} /><Tooltip {...chartTooltip} formatter={value => [String(value), "Heat score"]} /><Area type="monotone" dataKey="heatScore" stroke="#c85a2b" fill="url(#heatScore)" strokeWidth={2.5} isAnimationActive={false} connectNulls /></AreaChart></ResponsiveContainer></div></div><div className="policy-check-panel"><p className="app-eyebrow">Policy check / v1.0</p><h2>All qualification checks passed.</h2><div className="policy-checks"><div><CircleCheck size={17} /><span>34 °C threshold reached</span><strong>{peak.toFixed(1)} °C</strong></div><div><CircleCheck size={17} /><span>Continuous exposure required</span><strong>{String(exposure).padStart(2, "0")} hours</strong></div><div><CircleCheck size={17} /><span>Eligible crop stage</span><strong>{field.stage}</strong></div></div><Link href="/app/evidence/demo-042" className="evidence-link">Inspect evidence record <ArrowUpRight size={16} /></Link></div></section>
      </div>
    </AppShell>
  );
}
