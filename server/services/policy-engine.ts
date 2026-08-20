export const POLICY_RULE_VERSION = "HEAT-WHEAT-01 / v1.0";
export const DEFAULT_FRESHNESS_HOURS = 4;
export const HOURLY_INTERVAL_MS = 60 * 60 * 1000;

export type CropStage = "flowering" | "grain_filling" | string;
export type ObservationSource = "synthetic_demo" | "fortyguard";

export type NormalizedObservation = {
  observedAt: string;
  temperatureC: number;
  source: ObservationSource;
  quality?: "verified" | "estimated" | "stale";
};

export type PolicyInput = {
  id: string;
  version: string;
  thresholdC: number;
  minimumContinuousHours: number;
  eligibleStages: CropStage[];
  maximumSimulatedAmount: number;
  currency: string;
};

export type FieldInput = {
  id: string;
  crop: string;
  cropStage: CropStage;
  sourceStatus?: "synthetic_demo" | "fortyguard" | "stale" | "unavailable";
};

export type HeatEvaluation = {
  status: "safe" | "watch" | "triggered" | "data_unavailable";
  longestExposureHours: number;
  heatScore: number;
  payoutBand: "none" | "25_percent" | "50_percent" | "100_percent";
  simulatedAmount: number;
  currency: string;
  qualifyingReadings: NormalizedObservation[];
  reasons: string[];
  eventKey: string | null;
  policySnapshot: PolicyInput;
};

type EvaluateOptions = {
  evaluatedAt?: string;
  freshnessLimitHours?: number;
};

function asEpoch(timestamp: string) {
  const value = Date.parse(timestamp);
  if (Number.isNaN(value)) throw new Error(`Invalid observation timestamp: ${timestamp}`);
  return value;
}

function isEligibleStage(stage: CropStage, eligibleStages: CropStage[]) {
  return eligibleStages.includes(stage);
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function dataUnavailable(policy: PolicyInput, reason: string): HeatEvaluation {
  return {
    status: "data_unavailable",
    longestExposureHours: 0,
    heatScore: 0,
    payoutBand: "none",
    simulatedAmount: 0,
    currency: policy.currency,
    qualifyingReadings: [],
    reasons: [reason],
    eventKey: null,
    policySnapshot: policy,
  };
}

function payoutBandFor(exposureHours: number): HeatEvaluation["payoutBand"] {
  if (exposureHours >= 7) return "100_percent";
  if (exposureHours >= 5) return "50_percent";
  if (exposureHours >= 3) return "25_percent";
  return "none";
}

function payoutFraction(band: HeatEvaluation["payoutBand"]) {
  if (band === "100_percent") return 1;
  if (band === "50_percent") return 0.5;
  if (band === "25_percent") return 0.25;
  return 0;
}

export function evaluateHeatPolicy(
  field: FieldInput,
  policy: PolicyInput,
  observations: NormalizedObservation[],
  options: EvaluateOptions = {},
): HeatEvaluation {
  if (field.crop.toLowerCase() !== "wheat") {
    return dataUnavailable(policy, "This demonstration policy only evaluates wheat fields.");
  }
  if (field.sourceStatus === "stale" || field.sourceStatus === "unavailable") {
    return dataUnavailable(policy, "The latest source status is stale or unavailable.");
  }
  if (observations.length === 0) {
    return dataUnavailable(policy, "No normalized hourly temperature observations are available.");
  }

  const ordered = [...observations].sort((left, right) => asEpoch(left.observedAt) - asEpoch(right.observedAt));
  const freshnessReference = options.evaluatedAt ? asEpoch(options.evaluatedAt) : asEpoch(ordered.at(-1)!.observedAt);
  const latestEpoch = asEpoch(ordered.at(-1)!.observedAt);
  const freshnessLimit = (options.freshnessLimitHours ?? DEFAULT_FRESHNESS_HOURS) * HOURLY_INTERVAL_MS;

  if (freshnessReference - latestEpoch > freshnessLimit) {
    return dataUnavailable(policy, `The latest reading is older than the ${options.freshnessLimitHours ?? DEFAULT_FRESHNESS_HOURS}-hour freshness limit.`);
  }
  if (ordered.some((reading) => reading.quality === "stale")) {
    return dataUnavailable(policy, "At least one required observation is marked stale.");
  }
  if (ordered.some((reading, index) => index > 0 && asEpoch(reading.observedAt) - asEpoch(ordered[index - 1]!.observedAt) !== HOURLY_INTERVAL_MS)) {
    return dataUnavailable(policy, "A normalized hourly observation is missing, so the event window cannot be verified.");
  }
  if (!isEligibleStage(field.cropStage, policy.eligibleStages)) {
    return {
      status: "safe",
      longestExposureHours: 0,
      heatScore: 0,
      payoutBand: "none",
      simulatedAmount: 0,
      currency: policy.currency,
      qualifyingReadings: [],
      reasons: [`${field.cropStage} is not an eligible wheat growth stage for this policy.`],
      eventKey: null,
      policySnapshot: policy,
    };
  }

  let longest: NormalizedObservation[] = [];
  let current: NormalizedObservation[] = [];
  for (const observation of ordered) {
    if (observation.temperatureC >= policy.thresholdC) {
      current.push(observation);
      if (current.length > longest.length) longest = [...current];
    } else {
      current = [];
    }
  }

  const longestExposureHours = longest.length;
  const heatScore = round(longest.reduce((sum, reading) => sum + Math.max(0, reading.temperatureC - policy.thresholdC), 0));
  const payoutBand = payoutBandFor(longestExposureHours);
  const isTriggered = longestExposureHours >= policy.minimumContinuousHours;
  const status: HeatEvaluation["status"] = isTriggered ? "triggered" : longestExposureHours > 0 ? "watch" : "safe";
  const simulatedAmount = round(policy.maximumSimulatedAmount * payoutFraction(payoutBand));
  const reasons = [
    `${longestExposureHours} consecutive hourly readings reached the ${policy.thresholdC} °C threshold.`,
    `The field is in the eligible ${field.cropStage.replaceAll("_", " ")} stage.`,
    payoutBand === "none" ? "The event has not reached the minimum payout exposure." : `${payoutBand.replace("_", " ").replace("_", " ")} simulated payout band applies.`,
  ];
  const eventKey = longest.length ? `${field.id}:${policy.id}:${longest[0]!.observedAt}:${longest.at(-1)!.observedAt}` : null;

  return { status, longestExposureHours, heatScore, payoutBand, simulatedAmount, currency: policy.currency, qualifyingReadings: longest, reasons, eventKey, policySnapshot: policy };
}
