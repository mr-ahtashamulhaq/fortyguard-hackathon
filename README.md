# AgriGuard

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20AgriGuard-1f6f50?style=for-the-badge)](https://agriguard-eta.vercel.app)
[![Track](https://img.shields.io/badge/FortyGuard%20Hackathon%202026-Agentic%20(API%20%2B%20Agentic)-0d3428?style=for-the-badge)](https://www.fortyguard.com/hackathon26)

**[Open the live demo](https://agriguard-eta.vercel.app)**

AgriGuard is a transparent parametric heat-insurance prototype for wheat. It turns hourly temperature observations into a fixed policy result, an evidence record, and a simulated payout entry.

> **Safety boundary:** AgriGuard does not sell insurance, issue a policy, approve a real claim, or transfer money. Every payout, status, and ledger entry is simulated.

## The problem

Heat can damage wheat within hours. A parametric policy needs more than a chart. It needs a clear source, a fixed rule, a recorded result, and an explanation that a reviewer can inspect.

AgriGuard keeps these parts together. The system shows what it observed, which rule it applied, why the event triggered, and why the agent did not control the payout.

## Live judge demo

The live site has a public landing page and an operational demo.

| Open | What it proves |
| --- | --- |
| [Landing page](https://agriguard-eta.vercel.app) | The product problem, policy concept, and transparent design. |
| [`/app`](https://agriguard-eta.vercel.app/app) | Portfolio view, source labels, map, and monitoring flow. |
| [Verified evidence](https://agriguard-eta.vercel.app/app/evidence/LIVE-FRESNO-2024071514) | A stored FortyGuard historical event for the public Fresno wheat demo boundary. |
| [Ledger](https://agriguard-eta.vercel.app/app/ledger) | The idempotent simulated payout record. |

### Recommended 75-second flow

1. Open the portfolio. Point out the verified FortyGuard source label.
2. Open the Fresno field. Show the three continuous readings above the fixed 34 °C threshold.
3. Open the verified evidence record. Read the **observed → rule → recorded** decision chain.
4. Open the ledger. Point out the single 25% simulated payout record.
5. State the boundary: the agent explains the result, but cannot change the policy rule or amount.

## Verified event

The primary demo uses a public California Department of Water Resources 2023 crop-map polygon in Fresno County. It is a demonstration boundary, not a legal insured field boundary.

| UTC hour on 15 July 2024 | Field mean temperature |
| --- | ---: |
| 12:00 | 35.2 °C |
| 13:00 | 36.3 °C |
| 14:00 | 37.7 °C |

These three continuous readings meet the demo policy rule. The engine records a **25% simulated payout band** and a **$6,250 simulated amount**. The evidence record code is `LIVE-FRESNO-2024071514`.

## Fixed policy rule

The policy engine is the source of truth. This rule is for the hackathon prototype. It is not an insurance contract.

| Rule | Value |
| --- | --- |
| Crop | Wheat |
| Eligible stages | `flowering` and `grain_filling` |
| Threshold | 34 °C or higher |
| Trigger | Three continuous qualifying hourly readings |
| 25% band | Three or four continuous hours |
| 50% band | Five or six continuous hours |
| 100% band | Seven or more continuous hours |
| Missing or stale data | `Data unavailable`; no payout |

## Why this is Agentic AI

The agent uses a small allow-listed toolset. It can retrieve a field, read a completed policy evaluation, create linked evidence, and write an explanation. The server controls the data writes, policy values, payout band, and amount.

| Layer | Responsibility | Agent boundary |
| --- | --- | --- |
| FortyGuard adapter | Normalizes hourly temperature observations. | The agent cannot alter observations. |
| Policy engine | Applies the fixed heat rule and payout bands. | No LLM call. |
| Groq explanation agent | Retrieves and explains recorded evidence. | Cannot change the rule, stage, band, or amount. |
| Supabase Postgres | Stores fields, observations, evidence, payouts, and audit entries. | Server-only writes. |
| Operational UI | Shows sources, evidence, and simulation labels. | Every payout stays simulated. |

If Groq is unavailable, AgriGuard writes a stable template explanation. The deterministic policy and evidence path remain available.

## Technical stack

| Area | Technology |
| --- | --- |
| Client | React 19, TypeScript, Vite, Tailwind CSS, Wouter |
| Server | Express, tRPC, Zod, Vercel serverless entry |
| Data | Supabase Postgres with RLS-enabled tables |
| Weather intelligence | FortyGuard heatmap API |
| Agent | Groq local function calling with a controlled toolset |
| Maps and charts | Leaflet, OpenStreetMap, Recharts |
| Motion | Framer Motion, GSAP, Lenis |

## Project structure

```text
client/src/pages/                 Landing, portfolio, field, evidence, and ledger routes
client/src/components/            Reusable product components
server/services/policy-engine.ts  Deterministic heat policy logic
server/services/temperature-adapter.ts
                                 Synthetic and FortyGuard observation adapter
server/services/monitoring-agent.ts
                                 Controlled Groq explanation flow and template fallback
server/services/monitoring-service.ts
                                 Evidence, ledger, and idempotency workflow
supabase/migrations/              Versioned Postgres schema
docs/ARCHITECTURE.md               System architecture
docs/HACKATHON_JUDGE_DEMO.md       Judge demo script and backup recording runbook
docs/VERCEL_DEPLOYMENT.md          Vercel configuration reference
```

## Run locally

Install the dependencies.

```bash
pnpm install
```

Set the required environment variables. Do not commit a `.env` file.

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser-safe Supabase key. |
| `SUPABASE_SECRET_KEY` | Server-only Supabase key. |
| `FORTYGUARD_API_KEY` | Server-only key for the verified history flow. |
| `GROQ_API_KEY` | Server-only key for the controlled explanation agent. |
| `JWT_SECRET` | Server-only session secret. |

Start the development server.

```bash
pnpm dev
```

Run the project checks before a demo.

```bash
pnpm check
pnpm test
pnpm build
```

## Deploy on Vercel

The live deployment uses `vercel.json` and the serverless entry in `api/[...path].ts`.

Set these values in Vercel for Production, Preview, and Development:

```text
VITE_DEPLOYMENT_TARGET=vercel
VITE_LANDING_VIDEO_URL=https://files.manuscdn.com/user_upload_by_module/session_file/310519663854899853/FJCxiYqDYSKMjHnl.mp4
VITE_LANDING_POSTER_URL=https://files.manuscdn.com/user_upload_by_module/session_file/310519663854899853/tJemZdmPnpbxvkMV.jpg
```

Then set the required server and Supabase variables from the local-setup table. Read [`docs/VERCEL_DEPLOYMENT.md`](docs/VERCEL_DEPLOYMENT.md) for the full deployment reference.

## References

[1] [FortyGuard API documentation](https://docs-api.fortyguard.com/docs/quickstart)

[2] [Groq local tool calling](https://console.groq.com/docs/tool-use/local-tool-calling)

[3] [California Statewide Crop Mapping](https://www.water.ca.gov/Programs/All-Programs/California-Statewide-Crop-Mapping)
