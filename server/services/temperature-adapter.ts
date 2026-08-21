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

export type FieldTemperatureProfile = { latitude: number; longitude: number; hectares: number };

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
  north: { latitude: 30.17, longitude: 71.49, hectares: 42 },
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
      body: JSON.stringify({ polygon_aoi: derivedFieldPolygon(profile), date_time: { start_date: hour.toISOString().slice(0, 10), start_time: hour.toISOString().slice(11, 16), filter_type: 1 }, granularity: 100, analytic_type: "tcm" }),
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
      for (const hour of lastCompletedHours(this.now())) {
        const activityId = await this.submitHour(profile, hour);
        activityIds.push(activityId);
        const completedResult = await this.completedResult(activityId);
        const stats = asRecord(asRecord(completedResult)?.stats_data);
        if (stats?.n_cells === 0) throw new Error(`FortyGuard returned zero temperature cells for ${fieldId}'s derived field boundary and requested hour.`);
        const temperatureC = extractMeanTemperature(completedResult);
        if (temperatureC === null) throw new Error(`FortyGuard result ${activityId} did not contain stats_data.temperature_stats.mean.`);
        observations.push({ observedAt: hour.toISOString(), temperatureC, source: "fortyguard", quality: "verified" });
      }
      return { source: "fortyguard", observations, sourceStatus: "fortyguard", fetchedAt, metadata: { activityIds, statistic: "stats_data.temperature_stats.mean", geometrySource: "derived_from_field_centre_and_hectares", granularityMetres: 100 } };
    } catch (error) {
      return { source: "fortyguard", observations: [], sourceStatus: "unavailable", fetchedAt, error: error instanceof Error ? error.message : "FortyGuard request failed.", metadata: { activityIds, geometrySource: "derived_from_field_centre_and_hectares", granularityMetres: 100 } };
    }
  }
}

export function createTemperatureAdapter(source: ObservationSource): TemperatureAdapter {
  return source === "synthetic_demo" ? new SyntheticDemoTemperatureAdapter() : new FortyGuardTemperatureAdapter();
}
