import { describe, expect, it, vi } from "vitest";
import { FortyGuardTemperatureAdapter, extractMeanTemperature } from "./temperature-adapter";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("FortyGuardTemperatureAdapter", () => {
  it("requests three completed hourly tcm heatmaps and normalizes their mean temperatures", async () => {
    const fetchFn = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>();
    fetchFn
      .mockResolvedValueOnce(jsonResponse({ data: { activity_id: "a-1" } }))
      .mockResolvedValueOnce(jsonResponse({ data: { status: "Completed", result: { stats_data: { temperature_stats: { mean: 34.24 } } } } }))
      .mockResolvedValueOnce(jsonResponse({ data: { activity_id: "a-2" } }))
      .mockResolvedValueOnce(jsonResponse({ data: { status: "Completed", result: { stats_data: { temperature_stats: { mean: 35.15 } } } } }))
      .mockResolvedValueOnce(jsonResponse({ data: { activity_id: "a-3" } }))
      .mockResolvedValueOnce(jsonResponse({ data: { status: "Completed", result: { stats_data: { temperature_stats: { mean: 36.06 } } } } }));
    const adapter = new FortyGuardTemperatureAdapter({ apiKey: "test-key", fetchFn, now: () => new Date("2026-08-21T14:34:00.000Z"), sleep: async () => undefined });

    const result = await adapter.getHourlyObservations("north");

    expect(result.sourceStatus).toBe("fortyguard");
    expect(result.observations.map((observation) => observation.temperatureC)).toEqual([34.2, 35.2, 36.1]);
    expect(result.observations.map((observation) => observation.observedAt)).toEqual([
      "2026-08-21T11:00:00.000Z",
      "2026-08-21T12:00:00.000Z",
      "2026-08-21T13:00:00.000Z",
    ]);
    expect(fetchFn).toHaveBeenCalledTimes(6);
    const firstPayload = JSON.parse(String(fetchFn.mock.calls[0]?.[1]?.body));
    expect(firstPayload).toMatchObject({ analytic_type: "tcm", granularity: 100, date_time: { start_date: "2026-08-21", start_time: "11:00", filter_type: 1 } });
    expect(firstPayload.polygon_aoi.features[0].geometry.type).toBe("Polygon");
  });

  it("fails closed when a completed response has no field mean temperature", async () => {
    const fetchFn = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>()
      .mockResolvedValueOnce(jsonResponse({ data: { activity_id: "a-1" } }))
      .mockResolvedValueOnce(jsonResponse({ data: { status: "Completed", result: { stats_data: { temperature_stats: {} } } } }));
    const adapter = new FortyGuardTemperatureAdapter({ apiKey: "test-key", fetchFn, now: () => new Date("2026-08-21T14:34:00.000Z"), sleep: async () => undefined });

    const result = await adapter.getHourlyObservations("north");

    expect(result).toMatchObject({ source: "fortyguard", sourceStatus: "unavailable", observations: [] });
    expect(result.error).toContain("temperature_stats.mean");
  });

  it("returns unavailable when FortyGuard completes with zero temperature cells", async () => {
    const fetchFn = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>()
      .mockResolvedValueOnce(jsonResponse({ data: { activity_id: "a-1" } }))
      .mockResolvedValueOnce(jsonResponse({ data: { status: "Completed", result: { stats_data: { n_cells: 0 } } } }));
    const adapter = new FortyGuardTemperatureAdapter({ apiKey: "test-key", fetchFn, now: () => new Date("2026-08-21T14:34:00.000Z"), sleep: async () => undefined });

    const result = await adapter.getHourlyObservations("north");

    expect(result).toMatchObject({ sourceStatus: "unavailable", observations: [], metadata: { activityIds: ["a-1"] } });
    expect(result.error).toContain("zero temperature cells");
  });

  it("extracts documented mean values from camel and title-cased result structures", () => {
    expect(extractMeanTemperature({ stats_data: { temperature_stats: { mean: "34.6" } } })).toBe(34.6);
    expect(extractMeanTemperature({ stats_data: { Temperature_stats: { Mean: 35.4 } } })).toBe(35.4);
  });
});
