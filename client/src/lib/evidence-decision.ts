export type DecisionReading = {
  observedAt: string;
  temperatureC: number;
};

export type EvidenceRouteState = "demo" | "loading" | "unavailable" | "ready";

export function getDecisionFacts(readings: DecisionReading[]) {
  return {
    continuousHours: readings.length,
    peakTemperature: readings.length ? Math.max(...readings.map((reading) => reading.temperatureC)) : null,
  };
}

export function getEvidenceRouteState({
  recordCode,
  isLoading,
  isError,
  hasReport,
}: {
  recordCode: string;
  isLoading: boolean;
  isError: boolean;
  hasReport: boolean;
}): EvidenceRouteState {
  if (recordCode === "DEMO-042") return "demo";
  if (isLoading) return "loading";
  if (isError || !hasReport) return "unavailable";
  return "ready";
}
