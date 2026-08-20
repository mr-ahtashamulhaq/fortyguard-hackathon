import { describe, expect, it } from "vitest";
import { createTemplateExplanation, EvidenceExplanationSchema } from "./monitoring-agent";
import { evaluateHeatPolicy, type FieldInput, type NormalizedObservation, type PolicyInput } from "./policy-engine";

const field: FieldInput = { id: "north", crop: "wheat", cropStage: "grain_filling", sourceStatus: "synthetic_demo" };
const policy: PolicyInput = { id: "heat-wheat-01", version: "HEAT-WHEAT-01 / v1.0", thresholdC: 34, minimumContinuousHours: 3, eligibleStages: ["flowering", "grain_filling"], maximumSimulatedAmount: 25000, currency: "USD" };
const observations: NormalizedObservation[] = [34.7, 36.5, 38.1, 37.4, 35.1].map((temperatureC, index) => ({ observedAt: `2026-08-20T${String(index + 9).padStart(2, "0")}:00:00.000Z`, temperatureC, source: "synthetic_demo", quality: "verified" }));

describe("template monitoring explanation", () => {
  it("keeps the fallback report shape stable when Groq is unavailable", () => {
    const evaluation = evaluateHeatPolicy(field, policy, observations);
    const explanation = createTemplateExplanation({ field, policy, observations, evaluation });
    expect(EvidenceExplanationSchema.safeParse(explanation).success).toBe(true);
    expect(explanation.source).toBe("template");
    expect(explanation.disclaimer).toContain("synthetic");
  });
});
