import { describe, expect, it } from "vitest";
import { evaluateHeatPolicy, type FieldInput, type NormalizedObservation, type PolicyInput } from "./policy-engine";

const field: FieldInput = { id: "north", crop: "wheat", cropStage: "grain_filling", sourceStatus: "synthetic_demo" };
const policy: PolicyInput = { id: "heat-wheat-01", version: "HEAT-WHEAT-01 / v1.0", thresholdC: 34, minimumContinuousHours: 3, eligibleStages: ["flowering", "grain_filling"], maximumSimulatedAmount: 25000, currency: "USD" };
const temperatures = [27.6, 29.2, 32.8, 34.7, 36.5, 38.1, 37.4, 35.1, 32.6];
const readings: NormalizedObservation[] = temperatures.map((temperatureC, index) => ({ observedAt: `2026-08-20T${String(index + 6).padStart(2, "0")}:00:00.000Z`, temperatureC, source: "synthetic_demo", quality: "verified" }));

describe("evaluateHeatPolicy", () => {
  it("creates the approved 50 percent simulated payout for five continuous qualifying hours", () => {
    const result = evaluateHeatPolicy(field, policy, readings);
    expect(result).toMatchObject({ status: "triggered", longestExposureHours: 5, heatScore: 11.8, payoutBand: "50_percent", simulatedAmount: 12500 });
    expect(result.qualifyingReadings).toHaveLength(5);
    expect(result.eventKey).toContain("north:heat-wheat-01");
  });

  it("returns Watch for one or two qualifying hours", () => {
    const result = evaluateHeatPolicy(field, policy, readings.slice(0, 5));
    expect(result).toMatchObject({ status: "watch", longestExposureHours: 2, payoutBand: "none", simulatedAmount: 0 });
  });

  it("returns Data unavailable when a required hourly observation is missing", () => {
    const missingHour = readings.filter((reading) => !reading.observedAt.includes("10:00"));
    const result = evaluateHeatPolicy(field, policy, missingHour);
    expect(result).toMatchObject({ status: "data_unavailable", payoutBand: "none", simulatedAmount: 0 });
  });

  it("does not trigger an ineligible crop stage", () => {
    const result = evaluateHeatPolicy({ ...field, cropStage: "vegetative" }, policy, readings);
    expect(result).toMatchObject({ status: "safe", payoutBand: "none", simulatedAmount: 0 });
  });

  it("uses the exact event window in the idempotency key", () => {
    const first = evaluateHeatPolicy(field, policy, readings);
    const second = evaluateHeatPolicy(field, policy, readings);
    expect(first.eventKey).toBe(second.eventKey);
  });
});
