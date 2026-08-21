# FortyGuard API Integration Notes

**Checked:** 21 August 2026.  
**Status:** The server-only `FORTYGUARD_API_KEY` has passed a non-billable status-endpoint health check. AgriGuard now has an explicit live monitoring action that submits and polls three hourly `tcm` heatmaps. The synthetic demo remains the default judge flow.

## Verified official contract

The official API documentation describes API-key authentication through the `api-key` request header. Its asynchronous heatmap workflow submits a `POST` request to `https://api.fortyguard.com/v1/heatmap`, receives an `activity_id`, and polls `GET https://api.fortyguard.com/v1/status/{activity_id}` until the activity is completed or failed. The Heatmap endpoint accepts a GeoJSON polygon, a date-time window, and a spatial granularity. A temperature snapshot uses `analytic_type: "tcm"`; the completed result includes temperature statistics and GeoJSON map data.[1] [2] [3]

## AgriGuard adapter decision

AgriGuard uses the FortyGuard heatmap workflow for a three-hour hourly observation window. It requests `analytic_type: "tcm"`, extracts `result.stats_data.temperature_stats.mean`, normalizes it into `{ observedAt, temperatureC, source: "fortyguard" }`, and stores it in `temperature_observations`. The mean is the selected conservative, field-level statistic; it does not substitute a local maximum for the policy reading.

The primary hackathon profile now uses a public California Department of Water Resources Statewide Crop Mapping 2023 crop-area polygon: `UniqueID 1011953`, classified `G2` (Wheat), in Fresno County, California. The DWR legend defines `G2` as wheat. This is a transparent public demo boundary, not a legal parcel or an insured producer’s field boundary.[4] [5]

FortyGuard completed this public field’s 15 July 2024 12:00–14:00 UTC window with mean temperatures of 35.1539 °C, 36.3257 °C, and 37.6697 °C. AgriGuard rounds the readings to one decimal place before the unchanged deterministic policy evaluation. The dashboard labels the source as FortyGuard and keeps all payout labels simulated. Because the selected demonstration window is historical, the policy evaluates it at its latest verified observation time rather than against today’s clock; this preserves the freshness safeguard for both real-time and documented historical monitoring.

Other fields retain centre-and-hectares geometry only in explicit fallback code. The adapter labels that geometry source in stored metadata and fails closed if FortyGuard returns no temperature cells. No public crop-mapping polygon should be treated as a legal field boundary or used for a real insurance decision.

The synthetic heat-wave adapter remains the reliable demo path. It must not be removed when the live adapter is enabled.

## Required user input

The project stores the API key only as `FORTYGUARD_API_KEY`; it is never exposed to the browser or committed.

## References

[1]: https://docs-api.fortyguard.com/docs/quickstart "FortyGuard API Quickstart"
[2]: https://docs-api.fortyguard.com/docs/authentication "FortyGuard API Authentication"
[3]: https://docs-api.fortyguard.com/docs/create-heatmap "FortyGuard Create Heatmap"
[4]: https://data.cnra.ca.gov/dataset/statewide-crop-mapping "California Department of Water Resources Statewide Crop Mapping"
[5]: https://data.cnra.ca.gov/dataset/6c3d65e3-35bb-49e1-a51e-49d5a2cf09a9/resource/25d0f174-4bec-4987-a402-602cd1372786/download/i15_crop_mapping_final_2023.zip "California DWR Statewide Crop Mapping 2023 GIS Shapefile"
