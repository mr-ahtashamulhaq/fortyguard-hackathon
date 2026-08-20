# AgriGuard

AgriGuard is a hackathon prototype for **transparent parametric crop insurance**. It monitors wheat fields for damaging heat events, applies a fixed policy rule, produces an evidence record, and records a **simulated** payout. It is designed for the FortyGuard Hackathon.

> **Important:** AgriGuard does not issue insurance and does not move money. Every payout in this project is simulated.

## Hackathon track

**Primary submission track: Agentic (API + Agentic).**

AgriGuard uses the FortyGuard Temperature API as a data source and a Groq tool-calling monitoring agent to retrieve observations, invoke the deterministic policy engine, create evidence, and explain the result. The agent cannot change the rule or the simulated payout. This makes the agentic workflow central to the project rather than a decorative chat feature.

The project also supports the **Government & Environment** theme through climate-risk monitoring for wheat fields, but it will be submitted under **Agentic (API + Agentic)** because the controlled API-and-agent workflow is its clearest hackathon contribution.

## Product purpose

The product turns field temperature observations into an auditable decision. FortyGuard temperature data is the primary observation source. A deterministic policy engine decides whether a heat event qualifies. A Groq-powered agent explains the result, but it cannot change the policy rule or the payout band.

## Core product capabilities

| Capability | Purpose |
|---|---|
| Portfolio dashboard | Shows wheat fields on a map and in a list with Safe, Watch, Triggered, or Data unavailable status. |
| Heat policy engine | Applies the 34 °C, three-hour continuous exposure, and crop-stage requirements. |
| Evidence record | Stores the readings, policy result, data source, and explanation behind each decision. |
| Monitoring agent | Uses controlled backend tools to collect data, run the policy engine, create evidence, and explain the outcome. |
| Payout ledger | Shows triggered events and their simulated payout status. |
| Heat-wave scenario | Provides a labeled synthetic scenario for a reliable judge demonstration. |

## Trust principles

The policy engine is deterministic. The language model may create a plain-English explanation only after the backend has calculated the result. The product must show data source labels, synthetic-data labels where applicable, and simulated-payout disclaimers in every relevant view.

## Foundation stack

| Layer | Foundation choice |
|---|---|
| Client | React, TypeScript, Vite, Tailwind CSS |
| Server | Express and tRPC |
| Application database | Supabase Postgres |
| Field map | Leaflet and OpenStreetMap |
| Charts | Recharts |
| Agent explanation | Groq tool calling with a template fallback |
| Primary observation source | FortyGuard Temperature API |
| Hackathon track | Agentic (API + Agentic) |

The initial template includes Manus authentication and a template database for platform plumbing. The AgriGuard business data will use the separate Supabase project once the approved schema is applied.

## Project layout

```text
client/src/features/      Feature-level UI modules
client/src/lib/           Client integrations and helpers
server/routers/           Feature-level tRPC routers
server/services/          Policy, agent, and data-source services
shared/                   Shared types and stable product constants
docs/                     Product and architecture documentation
```

Read [the architecture notes](docs/ARCHITECTURE.md) before adding business features. Environment variable names and security boundaries are described in [the environment requirements](docs/ENVIRONMENT.md).

## Development

Install dependencies and start the local server:

```bash
pnpm install
pnpm dev
```

Run checks before opening a pull request:

```bash
pnpm check
pnpm test
```

## Repository scope

This repository contains product code, product documentation, and the PRD. The detailed implementation plan is intentionally maintained outside the repository.
