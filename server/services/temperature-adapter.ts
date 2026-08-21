import type { NormalizedObservation, ObservationSource } from "./policy-engine";

type FetchLike = typeof fetch;

export type TemperatureFetchResult = {
  source: ObservationSource;
  observations: NormalizedObservation[];
  sourceStatus: "synthetic_demo" | "fortyguard" | "stale" | "unavailable";
  fetchedAt: string;
  error?: string;
  metadata?: Record<string, unknown>;
};

export interface TemperatureAdapter {
  getHourlyObservations(fieldId: string): Promise<TemperatureFetchResult>;
}

export type FieldTemperatureProfile = { latitude: number; longitude: number; hectares: number; polygonAoi?: Record<string, unknown>; observationWindowStart?: string; geometrySource?: string };

type FortyGuardOptions = {
  apiKey?: string;
  baseUrl?: string;
  fetchFn?: FetchLike;
  now?: () => Date;
  sleep?: (milliseconds: number) => Promise<void>;
  pollIntervalMs?: number;
  maxPollAttempts?: number;
  profiles?: Record<string, FieldTemperatureProfile>;
};

type ApiEnvelope = {
  message?: string;
  data?: { activity_id?: string; status?: string; result?: unknown };
};

const northFieldHeatWave: NormalizedObservation[] = [
  ["06", 27.6], ["07", 29.2], ["08", 32.8], ["09", 34.7], ["10", 36.5], ["11", 38.1], ["12", 37.4], ["13", 35.1], ["14", 32.6],
].map(([hour, temperatureC]) => ({ observedAt: `2026-08-20T${hour}:00:00.000Z`, temperatureC: Number(temperatureC), source: "synthetic_demo" as const, quality: "verified" as const }));

export const fortyGuardFieldProfiles: Record<string, FieldTemperatureProfile> = {
  north: {
    latitude: 36.698172,
    longitude: -120.432656,
    hectares: 257.8,
    observationWindowStart: "2024-07-15T12:00:00.000Z",
    geometrySource: "California DWR Statewide Crop Mapping 2023, UniqueID 1011953, CROPTYP2 G2 (Wheat)",
    polygonAoi: { "type": "FeatureCollection", "features": [{ "type": "Feature", "properties": { "source": "California DWR Statewide Crop Mapping 2023", "unique_id": "1011953", "county": "Fresno", "crop_type": "G2", "crop_label": "Wheat", "acres": 637.036104484 }, "geometry": { "type": "Polygon", "coordinates": [[[-120.44163579599996,36.69161072500003],[-120.44170123099997,36.69167021000004],[-120.44157630899997,36.70510821700003],[-120.44157035999996,36.705256933000044],[-120.44148112999994,36.70536400900005],[-120.43445577299997,36.70544134100004],[-120.42374224899999,36.70542349600004],[-120.42368276299999,36.705405650000046],[-120.42361137799998,36.70535211200007],[-120.42357568599999,36.705256933000044],[-120.42371250499997,36.69101585900006],[-120.423724403,36.69095637200007],[-120.42376604299994,36.69092068000003],[-120.42386717,36.69091473100008],[-120.43962515199996,36.69090283500003],[-120.43980955899997,36.69091473200007],[-120.439882077,36.69094110300006],[-120.44014447999996,36.691589468000075],[-120.44032709199996,36.691598827000064],[-120.44163579599996,36.69161072500003]]] } }] },
  },
  east: { latitude: 30.11, longitude: 71.64, hectares: 28 },
  south: { latitude: 29.97, longitude: 71.55, hectares: 53 },
  west: { latitude: 30.08, longitude: 71.34, hectares: 16 },
};

export class SyntheticDemoTemperatureAdapter implements TemperatureAdapter {
  async getHourlyObservations(fieldId: string): Promise<TemperatureFetchResult> {
    return { source: "synthetic_demo", observations: fieldId === "north" ? northFieldHeatWave : [], sourceStatus: fieldId === "north" ? "synthetic_demo" : "unavailable", fetchedAt: "2026-08-20T14:00:00.000Z" };
  }
}

function lastCompletedHours(now: Date, count = 3) {
  const latest = new Date(now);
  latest.setUTCMinutes(0, 0, 0);
  latest.setUTCHours(latest.getUTCHours() - 1);
  return Array.from({ length: count }, (_, index) => new Date(latest.getTime() - ((count - 1 - index) * 60 * 60 * 1000)));
}

function observationHours(profile: FieldTemperatureProfile, now: Date, count = 3) {
  if (!profile.observationWindowStart) return lastCompletedHours(now, count);
  const start = new Date(profile.observationWindowStart);
  if (Number.isNaN(start.getTime())) throw new Error("FortyGuard observationWindowStart is invalid.");
  return Array.from({ length: count }, (_, index) => new Date(start.getTime() + (index * 60 * 60 * 1000)));
}

function derivedFieldPolygon({ latitude, longitude, hectares }: FieldTemperatureProfile) {
  const sideMetres = Math.sqrt(hectares * 10_000);
  const latitudeDelta = sideMetres / 222_640;
  const longitudeDelta = sideMetres / (222_640 * Math.cos((latitude * Math.PI) / 180));
  return {
    type: "FeatureCollection",
    features: [{ type: "Feature", properties: { geometry_source: "derived_from_field_centre_and_hectares" }, geometry: { type: "Polygon", coordinates: [[
      [longitude - longitudeDelta, latitude - latitudeDelta],
      [longitude + longitudeDelta, latitude - latitudeDelta],
      [longitude + longitudeDelta, latitude + latitudeDelta],
      [longitude - longitudeDelta, latitude + latitudeDelta],
      [longitude - longitudeDelta, latitude - latitudeDelta],
    ]] } }],
  };
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function asNumber(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : null;
}

export function extractMeanTemperature(result: unknown): number | null {
  const stats = asRecord(asRecord(result)?.stats_data);
  const temperatureStats = asRecord(stats?.temperature_stats) ?? asRecord(stats?.Temperature_stats);
  for (const candidate of [temperatureStats?.mean, temperatureStats?.Mean, stats?.mean, stats?.Mean, stats?.temperature_mean, stats?.average_temperature]) {
    const value = asNumber(candidate);
    if (value !== null) return Math.round(value * 10) / 10;
  }
  return null;
}

async function readEnvelope(response: Response): Promise<ApiEnvelope> {
  const text = await response.text();
  try { return JSON.parse(text) as ApiEnvelope; } catch { return { message: text.slice(0, 240) }; }
}

export class FortyGuardTemperatureAdapter implements TemperatureAdapter {
  private readonly apiKey: string | undefined;
  private readonly baseUrl: string;
  private readonly fetchFn: FetchLike;
  private readonly now: () => Date;
  private readonly sleep: (milliseconds: number) => Promise<void>;
  private readonly pollIntervalMs: number;
  private readonly maxPollAttempts: number;
  private readonly profiles: Record<string, FieldTemperatureProfile>;

  constructor(options: FortyGuardOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.FORTYGUARD_API_KEY;
    this.baseUrl = (options.baseUrl ?? "https://api.fortyguard.com/v1").replace(/\/$/, "");
    this.fetchFn = options.fetchFn ?? fetch;
    this.now = options.now ?? (() => new Date());
    this.sleep = options.sleep ?? ((milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)));
    this.pollIntervalMs = options.pollIntervalMs ?? 5_000;
    this.maxPollAttempts = options.maxPollAttempts ?? 24;
    this.profiles = options.profiles ?? fortyGuardFieldProfiles;
  }

  private headers() { return { "api-key": this.apiKey!, "Content-Type": "application/json" }; }

  private async submitHour(profile: FieldTemperatureProfile, hour: Date) {
    const response = await this.fetchFn(`${this.baseUrl}/heatmap`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ polygon_aoi: profile.polygonAoi ?? derivedFieldPolygon(profile), date_time: { start_date: hour.toISOString().slice(0, 10), start_time: hour.toISOString().slice(11, 16), filter_type: 1 }, granularity: 100, analytic_type: "tcm" }),
    });
    const payload = await readEnvelope(response);
    if (!response.ok || !payload.data?.activity_id) throw new Error(`FortyGuard heatmap submission failed (${response.status}): ${payload.message ?? "no activity id"}`);
    return payload.data.activity_id;
  }

  private async completedResult(activityId: string) {
    for (let attempt = 0; attempt < this.maxPollAttempts; attempt += 1) {
      const response = await this.fetchFn(`${this.baseUrl}/status/${encodeURIComponent(activityId)}`, { headers: this.headers() });
      const payload = await readEnvelope(response);
      if (!response.ok) throw new Error(`FortyGuard status request failed (${response.status}): ${payload.message ?? "unknown error"}`);
      const status = payload.data?.status?.toLowerCase();
      if (status === "completed" || status === "succeeded") return payload.data?.result;
      if (status === "failed" || status === "error") throw new Error(`FortyGuard activity ${activityId} ${status}.`);
      if (attempt < this.maxPollAttempts - 1) await this.sleep(this.pollIntervalMs);
    }
    throw new Error(`FortyGuard activity ${activityId} did not complete within ${this.maxPollAttempts * this.pollIntervalMs / 1000} seconds.`);
  }

  async getHourlyObservations(fieldId: string): Promise<TemperatureFetchResult> {
    const fetchedAt = this.now().toISOString();
    const profile = this.profiles[fieldId];
    if (!this.apiKey) return { source: "fortyguard", observations: [], sourceStatus: "unavailable", fetchedAt, error: "FortyGuard is not configured." };
    if (!profile) return { source: "fortyguard", observations: [], sourceStatus: "unavailable", fetchedAt, error: `No live field profile is configured for ${fieldId}.` };
    const activityIds: string[] = [];
    try {
      const observations: NormalizedObservation[] = [];
      for (const hour of observationHours(profile, this.now())) {
        const activityId = await this.submitHour(profile, hour);
        activityIds.push(activityId);
        const completedResult = await this.completedResult(activityId);
        const stats = asRecord(asRecord(completedResult)?.stats_data);
        if (stats?.n_cells === 0) throw new Error(`FortyGuard returned zero temperature cells for ${fieldId}'s configured field boundary and requested hour.`);
        const temperatureC = extractMeanTemperature(completedResult);
        if (temperatureC === null) throw new Error(`FortyGuard result ${activityId} did not contain stats_data.temperature_stats.mean.`);
        observations.push({ observedAt: hour.toISOString(), temperatureC, source: "fortyguard", quality: "verified" });
      }
      return { source: "fortyguard", observations, sourceStatus: "fortyguard", fetchedAt, metadata: { activityIds, statistic: "stats_data.temperature_stats.mean", geometrySource: profile.geometrySource ?? "derived_from_field_centre_and_hectares", observationWindowStart: profile.observationWindowStart ?? null, granularityMetres: 100 } };
    } catch (error) {
      return { source: "fortyguard", observations: [], sourceStatus: "unavailable", fetchedAt, error: error instanceof Error ? error.message : "FortyGuard request failed.", metadata: { activityIds, geometrySource: profile.geometrySource ?? "derived_from_field_centre_and_hectares", observationWindowStart: profile.observationWindowStart ?? null, granularityMetres: 100 } };
    }
  }
}

export function createTemperatureAdapter(source: ObservationSource): TemperatureAdapter {
  return source === "synthetic_demo" ? new SyntheticDemoTemperatureAdapter() : new FortyGuardTemperatureAdapter();
}
