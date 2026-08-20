import { describe, expect, it } from "vitest";
import { getEvidenceRecord, getPayoutLedger, runSyntheticHeatWaveScenario } from "./monitoring-service";

const hasSupabaseConfiguration = Boolean(process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);

describe.skipIf(!hasSupabaseConfiguration)("synthetic monitoring scenario", () => {
  it("persists one deterministic evidence and simulated payout record across repeat requests", async () => {
    const first = await runSyntheticHeatWaveScenario();
    const second = await runSyntheticHeatWaveScenario();

    expect(first.evaluation).toMatchObject({ status: "triggered", longestExposureHours: 5, heatScore: 11.8, payoutBand: "50_percent", simulatedAmount: 12500 });
    expect(first.payout?.isSimulated).toBe(true);
    expect(second.payout?.payoutKey).toBe(first.payout?.payoutKey);

    const evidence = await getEvidenceRecord(first.evidenceCode);
    expect(evidence?.record_code).toBe(first.evidenceCode);

    const ledger = await getPayoutLedger();
    expect(ledger.filter((entry: any) => entry.payout_key === first.payout?.payoutKey)).toHaveLength(1);
  }, 30000);
});
