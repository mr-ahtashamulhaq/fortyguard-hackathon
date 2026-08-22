import { describe, expect, it } from "vitest";
import { getDecisionFacts, getEvidenceRouteState } from "./evidence-decision";

describe("getDecisionFacts", () => {
  it("returns the qualifying duration and peak temperature for a verified heat event", () => {
    expect(getDecisionFacts([
      { observedAt: "2024-07-15T12:00:00.000Z", temperatureC: 35.2 },
      { observedAt: "2024-07-15T13:00:00.000Z", temperatureC: 36.3 },
      { observedAt: "2024-07-15T14:00:00.000Z", temperatureC: 37.7 },
    ])).toEqual({ continuousHours: 3, peakTemperature: 37.7 });
  });

  it("does not invent a peak temperature when no readings qualify", () => {
    expect(getDecisionFacts([])).toEqual({ continuousHours: 0, peakTemperature: null });
  });

  it("keeps the synthetic backup isolated from live record states", () => {
    expect(getEvidenceRouteState({ recordCode: "DEMO-042", isLoading: true, isError: true, hasReport: false })).toBe("demo");
  });

  it("shows loading only while a live record is being requested", () => {
    expect(getEvidenceRouteState({ recordCode: "LIVE-FRESNO-2024071514", isLoading: true, isError: false, hasReport: false })).toBe("loading");
  });

  it("shows unavailable for a missing or failed live record", () => {
    expect(getEvidenceRouteState({ recordCode: "LIVE-NOT-FOUND", isLoading: false, isError: false, hasReport: false })).toBe("unavailable");
    expect(getEvidenceRouteState({ recordCode: "LIVE-FRESNO-2024071514", isLoading: false, isError: true, hasReport: true })).toBe("unavailable");
  });

  it("shows a live record only when its report exists", () => {
    expect(getEvidenceRouteState({ recordCode: "LIVE-FRESNO-2024071514", isLoading: false, isError: false, hasReport: true })).toBe("ready");
  });
});
