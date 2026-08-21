import { describe, expect, it, vi } from "vitest";

const supabase = vi.hoisted(() => ({ from: vi.fn() }));

vi.mock("../supabase", () => ({ getSupabaseAdmin: () => supabase }));

import { getFieldDetail, getPortfolioData } from "./monitoring-service";

const policy = {
  id: "policy-live-readback",
  version: "HEAT-WHEAT-01 / v1.0",
  threshold_c: 34,
  minimum_continuous_hours: 3,
  eligible_stages: ["flowering", "grain_filling"],
  payout_currency: "USD",
  maximum_simulated_amount: 25000,
};

describe("live FortyGuard portfolio readback", () => {
  it("uses persisted verified observations instead of synthetic fallback data", async () => {
    const rows = [
      { observed_at: "2026-08-21T11:00:00.000Z", temperature_c: 34.2, quality: "verified" },
      { observed_at: "2026-08-21T12:00:00.000Z", temperature_c: 35.4, quality: "verified" },
      { observed_at: "2026-08-21T13:00:00.000Z", temperature_c: 36.1, quality: "verified" },
    ];
    supabase.from.mockImplementation((table: string) => {
      if (table === "fields") return { upsert: vi.fn().mockResolvedValue({ error: null }) };
      if (table === "policies") return { upsert: vi.fn(() => ({ select: () => ({ single: vi.fn().mockResolvedValue({ data: policy, error: null }) }) })) };
      if (table === "temperature_observations") return { select: vi.fn(() => ({ eq: () => ({ eq: () => ({ order: () => ({ limit: vi.fn().mockResolvedValue({ data: rows, error: null }) }) }) }) })) };
      throw new Error(`Unexpected table ${table}`);
    });

    const portfolio = await getPortfolioData();
    const north = portfolio.fields.find((field) => field.id === "north");

    expect(portfolio).toMatchObject({ source: "fortyguard", lastReading: "13:00 UTC" });
    expect(north).toMatchObject({ source: "FortyGuard", peak: 36.1, status: "Triggered" });

    const detail = await getFieldDetail("north");

    expect(detail).toMatchObject({ source: "fortyguard", lastObservedAt: "2026-08-21T13:00:00.000Z" });
    expect(detail?.field).toMatchObject({ source: "FortyGuard", peak: 36.1, status: "Triggered" });
  });
});
