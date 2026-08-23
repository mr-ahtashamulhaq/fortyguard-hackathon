# AgriGuard

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20AgriGuard-1f6f50?style=for-the-badge)](https://agriguard-eta.vercel.app)
[![FortyGuard Hackathon 2026](https://img.shields.io/badge/FortyGuard%20Hackathon-2026-0d3428?style=for-the-badge)](https://www.fortyguard.com/hackathon26)
[![Track](https://img.shields.io/badge/Track-Agentic%20(API%20%2B%20Agentic)-d97706?style=for-the-badge)](https://www.fortyguard.com/hackathon26)

**AgriGuard** is a transparent parametric heat-insurance prototype for wheat. It converts hourly temperature observations into a deterministic policy result, an auditable evidence record, and a simulated payout entry.

The project was built for the **FortyGuard Global AI Hackathon 2026**. It is submitted to the **Agentic (API + Agentic)** track.

**Live demo:** [agriguard-eta.vercel.app](https://agriguard-eta.vercel.app)

> **Scope:** AgriGuard is a hackathon prototype. It does not sell insurance, issue a policy, approve a claim, or transfer money. Every payout, status, and ledger entry is simulated.

## The problem

Extreme heat can damage wheat within a short time. Parametric insurance can respond faster than a traditional claim process, but only when the trigger is clear and reviewable.

Many systems show a weather chart but do not show the full decision path. A grower, insurer, or reviewer needs to know the source of the observation, the rule that applied, the event that triggered, and the reason for the recorded result.

## The solution

AgriGuard creates one evidence path from heat observation to policy outcome. It combines FortyGuard temperature intelligence, a fixed wheat heat rule, a controlled AI explanation agent, and an auditable operational interface.

| Capability | What AgriGuard does |
| --- | --- |
| **Heat monitoring** | Reads normalized hourly field temperatures from FortyGuard for the verified demonstration flow. |
| **Policy evaluation** | Applies a deterministic 34 °C, three-continuous-hour policy trigger. |
| **Evidence generation** | Stores observations, policy values, timing, heat score, result, and source in one record. |
| **Agentic explanation** | Uses a controlled Groq tool-calling agent to explain completed evidence without controlling the policy result. |
| **Payout simulation** | Records one idempotent simulated payout event for each qualifying event. |
| **Operational review** | Shows the portfolio, field details, evidence chain, and simulated ledger. |

## Product experience

AgriGuard has a public narrative and an operational review interface.

| Surface | Purpose |
| --- | --- |
| [Landing page](https://agriguard-eta.vercel.app) | Explains the heat-risk problem, policy model, evidence concept, and product design. |
| [`/app`](https://agriguard-eta.vercel.app/app) | Shows the operational portfolio, field state, map, and source-aware monitoring controls. |
| [`/app/fields/north`](https://agriguard-eta.vercel.app/app/fields/north) | Shows temperature readings, threshold, heat score, and policy status. |
| [Verified evidence record](https://agriguard-eta.vercel.app/app/evidence/LIVE-FRESNO-2024071514) | Shows the observed → rule → recorded decision chain. |
| [`/app/ledger`](https://agriguard-eta.vercel.app/app/ledger) | Shows the idempotent simulated payout ledger. |

## Demonstration event

The primary demonstration uses a public 2023 California Department of Water Resources crop-map polygon in Fresno County. The boundary represents wheat and is used only for the prototype. It is not a legal insured-field boundary.[1]

FortyGuard returned these historical field-mean observations for 15 July 2024:

| UTC hour | Field mean temperature |
| --- | ---: |
| 12:00 | 35.2 °C |
| 13:00 | 36.3 °C |
| 14:00 | 37.7 °C |

The three readings meet the prototype policy trigger. The system records a **25% simulated payout band** and a **$6,250 simulated amount** under evidence code `LIVE-FRESNO-2024071514`.

## Deterministic policy model

The policy engine is the source of truth. It is implemented as pure TypeScript and does not rely on an LLM for calculation.

| Policy input | Prototype rule |
| --- | --- |
| Crop | Wheat |
| Eligible growth stages | `flowering` and `grain_filling` |
| Heat threshold | 34 °C or higher |
| Reading interval | One normalized reading per hour |
| Trigger condition | At least three continuous qualifying hours |
| 25% payout band | Three or four continuous hours |
| 50% payout band | Five or six continuous hours |
| 100% payout band | Seven or more continuous hours |
| Missing, stale, or invalid data | `Data unavailable`; no payout result |

## Agentic AI design

AgriGuard uses an agent for evidence retrieval and explanation, not for financial or policy authority. The server defines a small allow-listed toolset. The agent can retrieve a selected field, read a completed evaluation, create linked evidence, and request a simulated payout record.

The server controls the policy values, source data, stage, payout band, amount, and database writes. The agent cannot change the deterministic outcome. Groq local tool calling keeps tool execution in the application, rather than in the model.[2]

```text
FortyGuard hourly observations
            │
            ▼
Temperature adapter ──► Deterministic policy engine
                                      │
                                      ▼
                         Evidence and idempotent payout record
                                      │
                                      ▼
                   Controlled Groq agent explains the record
                                      │
                                      ▼
                         Portfolio, evidence, and ledger UI
```

If the explanation model is unavailable, AgriGuard writes a stable template explanation. The fixed policy evaluation and evidence path remain available.

## Architecture

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Client | React 19, TypeScript, Vite, Wouter | Landing page and operational review routes. |
| API server | Express, tRPC, Zod | Typed application boundary and controlled server operations. |
| Temperature intelligence | FortyGuard heatmap API | Historical field-level temperature observations. |
| Policy engine | TypeScript | Fixed heat-event detection, scoring, and payout-band logic. |
| Agent | Groq function calling | Evidence explanation through server-defined tools. |
| Database | Supabase Postgres | Fields, policies, observations, evaluations, evidence, payouts, and audit entries. |
| Maps and charts | Leaflet, OpenStreetMap, Recharts | Spatial context and readable operational analysis. |
| Deployment | Vercel | Public production deployment with a serverless API entry. |

## Technical highlights

| Design decision | Benefit |
| --- | --- |
| Fixed policy engine | The rule and payout band remain repeatable and inspectable. |
| Idempotent payout key | Repeated monitoring does not create a duplicate simulated payout. |
| Source-aware states | The interface separates verified FortyGuard data from the synthetic fallback. |
| Fail-closed adapter | Missing cells or unusable data create no live policy result. |
| Controlled agent tools | The model can explain evidence but cannot alter a payout. |
| Persistent evidence | Verified records remain linked after a portfolio refresh. |

## Repository structure

```text
client/src/pages/                 Landing, portfolio, field, evidence, and ledger routes
client/src/components/            Reusable product components
server/services/policy-engine.ts  Deterministic heat-policy logic
server/services/temperature-adapter.ts
                                 FortyGuard and synthetic observation adapter
server/services/monitoring-agent.ts
                                 Controlled Groq explanation flow and fallback
server/services/monitoring-service.ts
                                 Evidence, ledger, and idempotency workflow
supabase/migrations/              Versioned Postgres schema
api/[...path].ts                  Vercel serverless API entry
docs/ARCHITECTURE.md               System architecture reference
docs/HACKATHON_JUDGE_DEMO.md       Judge demonstration script
docs/VERCEL_DEPLOYMENT.md          Deployment reference
```

## Safety and transparency

AgriGuard makes its demonstration limits visible in the interface and records. The Fresno crop boundary is public and demonstrative. All payout amounts are simulated. The synthetic scenario is a labelled fallback for a stable presentation when an external API is unavailable.

The prototype does not make underwriting decisions or represent a real insurance policy. It demonstrates how a transparent, evidence-first parametric workflow can support later human or institutional review.

## References

[1] [California Statewide Crop Mapping](https://www.water.ca.gov/Programs/All-Programs/California-Statewide-Crop-Mapping)

[2] [Groq local tool calling](https://console.groq.com/docs/tool-use/local-tool-calling)

[3] [FortyGuard API documentation](https://docs-api.fortyguard.com/docs/quickstart)
