import { getSupabaseAdmin } from "../supabase";
import { createAgentExplanation, createTemplateExplanation, type EvidenceExplanation } from "./monitoring-agent";
import { evaluateHeatPolicy, type FieldInput, type PolicyInput } from "./policy-engine";
import { createTemperatureAdapter } from "./temperature-adapter";

type FieldSeed = { id: string; name: string; region: string; latitude: number; longitude: number; hectares: number; cropStage: string; sourceStatus: "synthetic_demo" | "unavailable" };

const fieldSeeds: FieldSeed[] = [
  { id: "north", name: "North Field", region: "Punjab demo region", latitude: 30.17, longitude: 71.49, hectares: 42, cropStage: "grain_filling", sourceStatus: "synthetic_demo" },
  { id: "east", name: "East Plot", region: "Punjab demo region", latitude: 30.11, longitude: 71.64, hectares: 28, cropStage: "flowering", sourceStatus: "synthetic_demo" },
  { id: "south", name: "South Block", region: "Punjab demo region", latitude: 29.97, longitude: 71.55, hectares: 53, cropStage: "grain_filling", sourceStatus: "synthetic_demo" },
  { id: "west", name: "West Trial", region: "Punjab demo region", latitude: 30.08, longitude: 71.34, hectares: 16, cropStage: "flowering", sourceStatus: "unavailable" },
];

const northPolicySeed = { field_id: "north", version: "HEAT-WHEAT-01 / v1.0", threshold_c: 34, minimum_continuous_hours: 3, eligible_stages: ["flowering", "grain_filling"], payout_currency: "USD", maximum_simulated_amount: 25000, effective_from: "2026-01-01T00:00:00.000Z", effective_to: "2026-12-31T23:59:59.000Z", is_active: true };

export type PortfolioField = { id: string; name: string; farm: string; hectares: number; status: "Safe" | "Watch" | "Triggered" | "Data unavailable"; stage: string; lastReading: string; source: "Synthetic demo data" | "FortyGuard"; position: [number, number]; peak: number | null };

function presentationStatus(status: string): PortfolioField["status"] {
  if (status === "triggered") return "Triggered";
  if (status === "watch") return "Watch";
  if (status === "data_unavailable") return "Data unavailable";
  return "Safe";
}

function fieldDto(seed: FieldSeed, status: PortfolioField["status"], peak: number | null): PortfolioField {
  return { id: seed.id, name: seed.name, farm: seed.id === "north" || seed.id === "east" ? "Riverside Wheat" : "Meadowline Co-op", hectares: seed.hectares, status, stage: seed.cropStage === "grain_filling" ? "Grain filling" : "Flowering", lastReading: seed.id === "west" ? "—" : "14:00 UTC", source: "Synthetic demo data", position: [seed.latitude, seed.longitude], peak };
}

async function ensureBaseData() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { error: fieldsError } = await supabase.from("fields").upsert(fieldSeeds.map((field) => ({ id: field.id, name: field.name, region: field.region, latitude: field.latitude, longitude: field.longitude, hectares: field.hectares, crop: "wheat", crop_stage: field.cropStage, source_status: field.sourceStatus })), { onConflict: "id" });
  if (fieldsError) throw new Error(fieldsError.message);
  const { data: policy, error: policyError } = await supabase.from("policies").upsert(northPolicySeed, { onConflict: "field_id,version" }).select().single();
  if (policyError) throw new Error(policyError.message);
  return { supabase, policy };
}

function policyInput(policy: Record<string, unknown>): PolicyInput {
  return { id: String(policy.id), version: String(policy.version), thresholdC: Number(policy.threshold_c), minimumContinuousHours: Number(policy.minimum_continuous_hours), eligibleStages: (policy.eligible_stages as string[]) ?? [], maximumSimulatedAmount: Number(policy.maximum_simulated_amount), currency: String(policy.payout_currency) };
}

export async function getPortfolioData() {
  await ensureBaseData();
  const adapter = createTemperatureAdapter("synthetic_demo");
  const northReadings = await adapter.getHourlyObservations("north");
  const base = await ensureBaseData();
  if (!base) return { fields: [fieldDto(fieldSeeds[0]!, "Safe", 38.1), fieldDto(fieldSeeds[1]!, "Watch", 33.6), fieldDto(fieldSeeds[2]!, "Safe", 30.4), fieldDto(fieldSeeds[3]!, "Data unavailable", null)], source: "synthetic_demo" as const };
  const north = evaluateHeatPolicy({ id: "north", crop: "wheat", cropStage: "grain_filling", sourceStatus: northReadings.sourceStatus }, policyInput(base.policy), northReadings.observations, { evaluatedAt: northReadings.fetchedAt });
  return { fields: [fieldDto(fieldSeeds[0]!, presentationStatus(north.status), 38.1), fieldDto(fieldSeeds[1]!, "Watch", 33.6), fieldDto(fieldSeeds[2]!, "Safe", 30.4), fieldDto(fieldSeeds[3]!, "Data unavailable", null)], source: "synthetic_demo" as const };
}

export async function getFieldDetail(fieldId: string) {
  if (fieldId !== "north") return null;
  const base = await ensureBaseData();
  const adapter = createTemperatureAdapter("synthetic_demo");
  const temperature = await adapter.getHourlyObservations("north");
  const policy: PolicyInput = base ? policyInput(base.policy) : { id: "heat-wheat-01", version: northPolicySeed.version, thresholdC: 34, minimumContinuousHours: 3, eligibleStages: ["flowering", "grain_filling"], maximumSimulatedAmount: 25000, currency: "USD" };
  const field: FieldInput = { id: "north", crop: "wheat", cropStage: "grain_filling", sourceStatus: temperature.sourceStatus };
  const evaluation = evaluateHeatPolicy(field, policy, temperature.observations, { evaluatedAt: temperature.fetchedAt });
  let runningScore = 0;
  const readings = temperature.observations.map((observation) => {
    runningScore += Math.max(0, observation.temperatureC - policy.thresholdC);
    return { hour: new Date(observation.observedAt).toISOString().slice(11, 13), temp: observation.temperatureC, qualifying: observation.temperatureC >= policy.thresholdC, heatScore: Math.round(runningScore * 10) / 10 };
  });
  return { field: fieldDto(fieldSeeds[0]!, presentationStatus(evaluation.status), 38.1), policy, evaluation, readings, source: "synthetic_demo" as const, lastObservedAt: temperature.observations.at(-1)?.observedAt ?? null };
}

export async function runSyntheticHeatWaveScenario() {
  const base = await ensureBaseData();
  const adapter = createTemperatureAdapter("synthetic_demo");
  const temperature = await adapter.getHourlyObservations("north");
  const field: FieldInput = { id: "north", crop: "wheat", cropStage: "grain_filling", sourceStatus: temperature.sourceStatus };
  if (!base) {
    const fallbackPolicy: PolicyInput = { id: "heat-wheat-01", version: northPolicySeed.version, thresholdC: 34, minimumContinuousHours: 3, eligibleStages: ["flowering", "grain_filling"], maximumSimulatedAmount: 25000, currency: "USD" };
    const evaluation = evaluateHeatPolicy(field, fallbackPolicy, temperature.observations, { evaluatedAt: temperature.fetchedAt });
    const explanation = createTemplateExplanation({ field, policy: fallbackPolicy, observations: temperature.observations, evaluation });
    return { evaluation, explanation, evidenceCode: "DEMO-042", payout: evaluation.payoutBand === "none" ? null : { payoutKey: evaluation.eventKey, simulatedAmount: evaluation.simulatedAmount, payoutBand: evaluation.payoutBand, isSimulated: true } };
  }
  const policy = policyInput(base.policy);
  const evaluation = evaluateHeatPolicy(field, policy, temperature.observations, { evaluatedAt: temperature.fetchedAt });
  const observationRows = temperature.observations.map((observation) => ({ field_id: "north", source: observation.source, observed_at: observation.observedAt, temperature_c: observation.temperatureC, quality: observation.quality ?? "verified", source_metadata: { demo: true } }));
  const { error: observationError } = await base.supabase.from("temperature_observations").upsert(observationRows, { onConflict: "field_id,source,observed_at" });
  if (observationError) throw new Error(observationError.message);
  if (!evaluation.eventKey) throw new Error("The synthetic scenario did not produce an idempotency key.");
  const eventKey = evaluation.eventKey;
  const evaluationRow = { run_key: evaluation.eventKey, field_id: "north", policy_id: base.policy.id, source: "synthetic_demo", status: evaluation.status, qualifying_observation_count: evaluation.qualifyingReadings.length, continuous_exposure_hours: evaluation.longestExposureHours, heat_score: evaluation.heatScore, payout_band: evaluation.payoutBand, simulated_amount: evaluation.simulatedAmount, policy_snapshot: evaluation.policySnapshot, evaluated_at: temperature.fetchedAt };
  const { error: evaluationInsertError } = await base.supabase.from("heat_evaluations").upsert(evaluationRow, { onConflict: "run_key", ignoreDuplicates: true });
  if (evaluationInsertError) throw new Error(evaluationInsertError.message);
  const { data: storedEvaluation, error: evaluationFetchError } = await base.supabase.from("heat_evaluations").select().eq("run_key", evaluation.eventKey).single();
  if (evaluationFetchError) throw new Error(evaluationFetchError.message);
  const { data: existingEvidence } = await base.supabase.from("evidence_records").select().eq("evaluation_id", storedEvaluation.id).maybeSingle();
  const evidenceCode = existingEvidence?.record_code ?? "DEMO-042";
  const pendingExplanation = createTemplateExplanation({ field, policy, observations: temperature.observations, evaluation });
  const persistEvidence = async (explanation = pendingExplanation) => {
    const { error } = await base.supabase.from("evidence_records").upsert({ record_code: evidenceCode, evaluation_id: storedEvaluation.id, field_id: "north", report: { field: fieldDto(fieldSeeds[0]!, presentationStatus(evaluation.status), 38.1), policy, observations: temperature.observations, evaluation }, agent_explanation: JSON.stringify(explanation), agent_mode: explanation.source === "groq" ? "groq_tool_call" : "template_fallback" }, { onConflict: "evaluation_id" });
    if (error) throw new Error(error.message);
    return { evidenceCode, evaluationId: storedEvaluation.id, persisted: true };
  };
  const persistPayout = async (): Promise<{ payoutKey: string; simulatedAmount: number; payoutBand: string; isSimulated: true } | null> => {
    if (evaluation.payoutBand === "none") return null;
    const payoutKey = eventKey;
    const { error: payoutError } = await base.supabase.from("payout_events").upsert({ payout_key: payoutKey, evaluation_id: storedEvaluation.id, field_id: "north", policy_id: base.policy.id, payout_band: evaluation.payoutBand, simulated_amount: evaluation.simulatedAmount, currency: policy.currency, status: "ready_for_review", is_simulated: true }, { onConflict: "payout_key", ignoreDuplicates: true });
    if (payoutError) throw new Error(payoutError.message);
    return { payoutKey, simulatedAmount: evaluation.simulatedAmount, payoutBand: evaluation.payoutBand, isSimulated: true };
  };
  const explanation = await createAgentExplanation({ field, policy, observations: temperature.observations, evaluation }, {
    getFieldData: () => ({ field: fieldDto(fieldSeeds[0]!, presentationStatus(evaluation.status), 38.1), observations: temperature.observations }),
    evaluateHeatEvent: () => ({ evaluation }),
    createEvidenceRecord: () => persistEvidence(),
    createSimulatedPayout: () => persistPayout(),
  });
  await persistEvidence(explanation);
  const payout = await persistPayout();
  await base.supabase.from("audit_entries").insert({ entity_type: "evaluation", entity_id: storedEvaluation.id, action: "synthetic_heat_wave_monitored", details: { runKey: evaluation.eventKey, explanationSource: explanation.source } });
  return { evaluation, explanation, evidenceCode, payout };
}

export async function getEvidenceRecord(recordCode: string) {
  const base = await ensureBaseData();
  if (!base) return null;
  const { data, error } = await base.supabase.from("evidence_records").select("*, heat_evaluations(*)").eq("record_code", recordCode).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getPayoutLedger() {
  const base = await ensureBaseData();
  if (!base) return [];
  const { data, error } = await base.supabase.from("payout_events").select("*, fields(name)").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const evaluationIds = (data ?? []).map((entry: any) => entry.evaluation_id);
  if (evaluationIds.length === 0) return [];
  const { data: evidenceRecords, error: evidenceError } = await base.supabase.from("evidence_records").select("evaluation_id, record_code").in("evaluation_id", evaluationIds);
  if (evidenceError) throw new Error(evidenceError.message);
  const evidenceByEvaluation = new Map((evidenceRecords ?? []).map((record: any) => [record.evaluation_id, record.record_code]));
  return (data ?? []).map((entry: any) => ({ ...entry, evidence_code: evidenceByEvaluation.get(entry.evaluation_id) ?? entry.payout_key }));
}

export { presentationStatus };
