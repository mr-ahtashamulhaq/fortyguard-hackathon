import type { NormalizedObservation, ObservationSource } from "./policy-engine";

export type TemperatureFetchResult = {
  source: ObservationSource;
  observations: NormalizedObservation[];
  sourceStatus: "synthetic_demo" | "fortyguard" | "stale" | "unavailable";
  fetchedAt: string;
  error?: string;
};

export interface TemperatureAdapter {
  getHourlyObservations(fieldId: string): Promise<TemperatureFetchResult>;
}

const northFieldHeatWave: NormalizedObservation[] = [
  ["06", 27.6], ["07", 29.2], ["08", 32.8], ["09", 34.7], ["10", 36.5], ["11", 38.1], ["12", 37.4], ["13", 35.1], ["14", 32.6],
].map(([hour, temperatureC]) => ({ observedAt: `2026-08-20T${hour}:00:00.000Z`, temperatureC: Number(temperatureC), source: "synthetic_demo" as const, quality: "verified" as const }));

export class SyntheticDemoTemperatureAdapter implements TemperatureAdapter {
  async getHourlyObservations(fieldId: string): Promise<TemperatureFetchResult> {
    return {
      source: "synthetic_demo",
      observations: fieldId === "north" ? northFieldHeatWave : [],
      sourceStatus: fieldId === "north" ? "synthetic_demo" : "unavailable",
      fetchedAt: "2026-08-20T14:00:00.000Z",
    };
  }
}

export class FortyGuardTemperatureAdapter implements TemperatureAdapter {
  constructor(private readonly endpoint = process.env.FORTYGUARD_TEMPERATURE_API_URL) {}

  async getHourlyObservations(_fieldId: string): Promise<TemperatureFetchResult> {
    if (!this.endpoint) {
      return { source: "fortyguard", observations: [], sourceStatus: "unavailable", fetchedAt: new Date().toISOString(), error: "FortyGuard Temperature API is not configured yet." };
    }
    return { source: "fortyguard", observations: [], sourceStatus: "unavailable", fetchedAt: new Date().toISOString(), error: "The FortyGuard adapter is ready for the API contract but has no production mapping yet." };
  }
}

export function createTemperatureAdapter(source: ObservationSource): TemperatureAdapter {
  return source === "synthetic_demo" ? new SyntheticDemoTemperatureAdapter() : new FortyGuardTemperatureAdapter();
}
