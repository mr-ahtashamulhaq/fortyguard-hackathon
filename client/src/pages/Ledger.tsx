import { AppShell, RunMonitorButton } from "@/components/AppShell";
import { ledgerEntries } from "@/lib/demo-data";
import { BookOpenText, ChevronRight, CircleDollarSign } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

type LedgerEntry = { id: string; field: string; date: string; band: string; amount: string; status: string };

export default function Ledger() {
  const { data: storedLedger } = trpc.agriGuard.ledger.useQuery();
  const persistedEntries: LedgerEntry[] = (storedLedger ?? []).map((entry: any) => ({ id: entry.evidence_code, field: entry.fields?.name ?? "North Field", date: new Date(entry.created_at).toLocaleDateString(undefined, { dateStyle: "medium" }), band: entry.payout_band === "50_percent" ? "50%" : entry.payout_band === "25_percent" ? "25%" : "100%", amount: `$${Number(entry.simulated_amount).toLocaleString()}`, status: entry.status === "ready_for_review" ? "Ready for review" : entry.status[0].toUpperCase() + entry.status.slice(1) }));
  const entries: LedgerEntry[] = persistedEntries.length ? persistedEntries : ledgerEntries;
  const total = entries.reduce((sum, entry) => sum + Number(entry.amount.replace(/[^0-9.]/g, "")), 0);
  return (
    <AppShell action={<RunMonitorButton />}>
      <div className="app-page ledger-page"><div className="app-page-heading"><div><p className="app-eyebrow">Simulated payout ledger</p><h1>Decisions awaiting human review.</h1><p>Entries become visible only after the policy engine stores a complete evidence record.</p></div><div className="ledger-total"><CircleDollarSign size={19} /><span>Total simulated exposure</span><strong>${total.toLocaleString()}</strong></div></div><div className="ledger-disclaimer"><BookOpenText size={17} /><span>All amounts are simulated. AgriGuard does not issue insurance or transfer money.</span></div><section className="ledger-table-wrap"><table className="ledger-table"><thead><tr><th>Evidence ID</th><th>Field</th><th>Event date</th><th>Payout band</th><th>Simulated amount</th><th>Status</th><th /></tr></thead><tbody>{entries.map(entry => <tr key={entry.id}><td className="ledger-id">{entry.id}</td><td>{entry.field}</td><td>{entry.date}</td><td>{entry.band}</td><td className="ledger-amount">{entry.amount}</td><td><span className={`ledger-status ${entry.status.toLowerCase().replaceAll(" ", "-")}`}>{entry.status}</span></td><td><Link href="/app/evidence/demo-042" className="ledger-open">Open <ChevronRight size={16} /></Link></td></tr>)}</tbody></table></section></div>
    </AppShell>
  );
}
