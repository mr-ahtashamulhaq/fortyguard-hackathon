# FortyGuard API Integration Notes

**Checked:** 21 August 2026.  
**Status:** The server-only `FORTYGUARD_API_KEY` has passed a non-billable status-endpoint health check. AgriGuard now has an explicit live monitoring action that submits and polls three hourly `tcm` heatmaps. The synthetic demo remains the default judge flow.

## Verified official contract

The official API documentation describes API-key authentication through the `api-key` request header. Its asynchronous heatmap workflow submits a `POST` request to `https://api.fortyguard.com/v1/heatmap`, receives an `activity_id`, and polls `GET https://api.fortyguard.com/v1/status/{activity_id}` until the activity is completed or failed. The Heatmap endpoint accepts a GeoJSON polygon, a date-time window, and a spatial granularity. A temperature snapshot uses `analytic_type: "tcm"`; the completed result includes temperature statistics and GeoJSON map data.[1] [2] [3]

## AgriGuard adapter decision

AgriGuard uses the FortyGuard heatmap workflow for the last three completed UTC hours. It requests `analytic_type: "tcm"`, extracts `result.stats_data.temperature_stats.mean`, normalizes it into `{ observedAt, temperatureC, source: "fortyguard" }`, and stores it in `temperature_observations`. The mean is the selected conservative, field-level statistic; it does not substitute a local maximum for the policy reading.

The seed records currently store field centre points and hectares, not surveyed boundaries. The adapter therefore derives a small square GeoJSON polygon from that centre and area, labels its geometry source in the stored metadata, and fails closed if FortyGuard returns no temperature cells. A 21 August 2026 live request for the North Field seed completed with `n_cells: 0`, so no policy evaluation, evidence record, or simulated payout was created from it. The dashboard keeps the synthetic demo intact and reports the data as unavailable. Before live agricultural monitoring is enabled by default, replace these derived polygons with verified field GeoJSON boundaries in a FortyGuard-covered area.

The synthetic heat-wave adapter remains the reliable demo path. It must not be removed when the live adapter is enabled.

## Required user input

The project stores the API key only as `FORTYGUARD_API_KEY`; it is never exposed to the browser or committed.

## References

[1]: https://docs-api.fortyguard.com/docs/quickstart "FortyGuard API Quickstart"
[2]: https://docs-api.fortyguard.com/docs/authentication "FortyGuard API Authentication"
[3]: https://docs-api.fortyguard.com/docs/create-heatmap "FortyGuard Create Heatmap"
