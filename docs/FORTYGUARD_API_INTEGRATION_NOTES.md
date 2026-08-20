# FortyGuard API Integration Notes

**Checked:** 21 August 2026.  
**Status:** The adapter remains paused until a server-only `FORTYGUARD_API_KEY` is provided.

## Verified official contract

The official API documentation describes API-key authentication through the `api-key` request header. Its asynchronous heatmap workflow submits a `POST` request to `https://api.fortyguard.com/v1/heatmap`, receives an `activity_id`, and polls `GET https://api.fortyguard.com/v1/status/{activity_id}` until the activity is completed or failed. The Heatmap endpoint accepts a GeoJSON polygon, a date-time window, and a spatial granularity. A temperature snapshot uses `analytic_type: "tcm"`; the completed result includes temperature statistics and GeoJSON map data.[1] [2] [3]

## AgriGuard adapter decision

AgriGuard should use the FortyGuard heatmap workflow for a bounded hourly window, extract an agreed field-level temperature statistic from each completed result, normalize it into `{ observedAt, temperatureC, source: "fortyguard" }`, and store it in `temperature_observations`. The exact statistic, such as field mean or maximum temperature, must be agreed before enabling production monitoring because the documentation describes multiple aggregated temperature outputs.

The synthetic heat-wave adapter remains the reliable demo path. It must not be removed when the live adapter is enabled.

## Required user input

Provide a valid FortyGuard Enterprise API key. Store it only as `FORTYGUARD_API_KEY`; do not expose it to the browser or commit it.

## References

[1]: https://docs-api.fortyguard.com/docs/quickstart "FortyGuard API Quickstart"
[2]: https://docs-api.fortyguard.com/docs/authentication "FortyGuard API Authentication"
[3]: https://docs-api.fortyguard.com/docs/create-heatmap "FortyGuard Create Heatmap"
