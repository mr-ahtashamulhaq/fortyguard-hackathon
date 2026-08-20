# AgriGuard

AgriGuard is a **transparent parametric heat-insurance prototype for wheat fields**. It turns hourly temperature observations into a deterministic policy result, an evidence record, and a **simulated** payout entry. The prototype was built for the **FortyGuard Global AI Hackathon 2026** and is submitted in the **Agentic (API + Agentic)** track.

> **Safety boundary:** AgriGuard does not sell insurance, issue a policy, approve a real claim, or transfer money. Every payout amount, status, and ledger entry is explicitly simulated.

## Why this project fits the Agentic track

The monitoring flow uses a Groq tool-calling agent with a small, allow-listed server toolset. The agent can retrieve the selected field, read the deterministic evaluation, create its linked evidence record, and request an idempotent simulated payout record. The server, not the model, controls the database, rule values, payout band, and amount. The agent can only explain the result after the fixed policy engine has calculated it. Groq documents this local function-calling pattern, in which the application executes the tools and returns the results to the model.[1]

| Layer | Responsibility | Trust boundary |
|---|---|---|
| Temperature adapter | Returns normalized hourly readings with a source label. | Synthetic data is used until the FortyGuard contract is available. |
| Policy engine | Applies the fixed heat rule and payout bands. | Pure TypeScript; no LLM call. |
| Monitoring agent | Calls only server-defined tools and writes an explanation. | Cannot change the rule, source data, stage, band, or amount. |
| Supabase Postgres | Stores fields, policies, observations, evaluations, evidence, payouts, and audit entries. | Server uses the secret key; the browser never receives it. |
| Operational UI | Shows the portfolio, field evidence, and simulated ledger. | Source and simulation labels remain visible. |

## Deterministic policy rule

The engine is the source of truth. This is a hackathon demonstration rule, not an insurance contract.

| Rule | Fixed value |
|---|---|
| Crop | Wheat only |
| Eligible stages | `flowering` and `grain_filling` |
| Temperature threshold | **34 °C or above** |
| Reading interval | One normalized reading per hour |
| Event break | Below-threshold reading, missing hourly reading, stale data, or ineligible stage |
| Trigger condition | At least **three continuous qualifying hours** |
| 25% band | Three or four continuous hours |
| 50% band | Five or six continuous hours |
| 100% band | Seven or more continuous hours |
| Heat score | Sum of `max(0, temperatureC - 34)` across the longest qualifying event |

The approved North Field scenario contains five qualifying hours. It therefore produces a **50% simulated payout band**, a **11.8 degree-hour** heat score, and a fixed **$12,500 simulated amount**.

## Product surfaces

AgriGuard has two deliberate surfaces.

| Route | Purpose |
|---|---|
| `/` | Animated landing page that explains the policy, evidence trail, and Agentic-track value. |
| `/app` | Portfolio dashboard with Leaflet and OpenStreetMap field map, field states, and a judge demo control. |
| `/app/fields/north` | Deterministic temperature and heat-score charts with a visible 34 °C threshold. |
| `/app/evidence/demo-042` | Structured event evidence, qualifying observations, policy values, and agent explanation. |
| `/app/ledger` | Idempotent simulated payout ledger with a permanent simulation disclaimer. |

## Judge demo flow

The complete demo is designed to take less than three minutes.

1. Open `/app` and point out the visible **Synthetic demo data** label and the four field states.
2. Select **Run scenario** for North Field. The interface shows observe, apply, and record states through the agent-status panel.
3. The server loads fixed synthetic readings, applies the deterministic rule, writes the evaluation and evidence record, and requests one idempotent simulated payout.
4. Open the evidence record to inspect the five qualifying readings, 34 °C threshold, exposure time, heat score, policy version, source label, and explanation.
5. Open the simulated ledger. Re-running the scenario returns the same payout key and does not create a duplicate ledger row.

## Data sources and fallback behavior

FortyGuard temperature data is intended to be the primary source. The project includes a swappable `FortyGuardTemperatureAdapter`, but the provider API contract is still pending. The deployed hackathon flow uses `SyntheticDemoTemperatureAdapter` and labels every affected route accordingly.

The Groq explanation path is intentionally optional for the decision. If Groq is rate-limited, unavailable, or returns invalid structured content, AgriGuard writes a template explanation with the same stable shape. The demo remains operational because the policy engine and storage path do not depend on model output.

| Condition | Product response |
|---|---|
| Missing hourly observation | `Data unavailable`; no payout. |
| Stale reading | `Data unavailable`; no payout. |
| Ineligible crop stage | Safe result; no payout. |
| Groq failure | Template explanation; deterministic result remains unchanged. |
| Repeat scenario request | Existing evidence and payout are returned; no duplicate payout row. |
| FortyGuard API unavailable | Synthetic demo remains available and clearly labeled. |

## Stack

| Area | Technology |
|---|---|
| Client | React 19, TypeScript, Vite, Tailwind CSS, Wouter |
| Server | Express, tRPC, Zod |
| Data | Supabase Postgres with RLS enabled tables |
| Maps and charts | Leaflet + OpenStreetMap, Recharts |
| Motion | Framer Motion, GSAP, Lenis |
| Visual system | Magic UI Globe, branded CSS system, light and dark themes |
| Agent | Groq Chat Completions local function calling with a template fallback |

## Database schema

The `supabase/migrations/0001_agri_guard_schema.sql` migration creates the following RLS-enabled records in the `agri-guard` project: `fields`, `policies`, `temperature_observations`, `heat_evaluations`, `evidence_records`, `payout_events`, and `audit_entries`.

Duplicate prevention has two layers. The policy engine creates a stable event key from the field, policy, and qualifying time window. Supabase enforces unique `run_key`, `evaluation_id`, and `payout_key` constraints so a repeat scenario returns the existing simulated payout rather than creating another record.

## Local setup

Install dependencies and start the development server.

```bash
pnpm install
pnpm dev
```

Set the following project environment variables. Do not commit a local `.env` file.

| Variable | Purpose | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project root URL or REST URL. The client normalizes either form. | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser-safe Supabase publishable key. | Yes |
| `SUPABASE_SECRET_KEY` | Server-only key for controlled writes and RLS bypass. | Yes |
| `GROQ_API_KEY` | Server-only key for the controlled explanation agent. | Recommended; a template fallback exists. |
| `FORTYGUARD_TEMPERATURE_API_URL` | Future FortyGuard endpoint. | No, until the API contract is released. |

Run the project checks before a demo or pull request.

```bash
pnpm check
pnpm test
pnpm build
```

The test suite includes policy-rule tests, missing-data checks, template-explanation shape checks, Supabase and Groq credential health checks, and a persisted scenario test that verifies payout idempotency.

## Repository map

```text
client/src/pages/                 Landing and operational routes
client/src/components/            Shared map, shell, agent-status, and interaction components
client/src/contexts/              Monitoring state and theme state
client/src/lib/supabase.ts        Browser-safe publishable-key client
server/services/policy-engine.ts  Pure deterministic heat policy engine
server/services/temperature-adapter.ts
                                 Swappable synthetic and FortyGuard adapter boundary
server/services/monitoring-agent.ts
                                 Controlled Groq local-function orchestration and fallback report
server/services/monitoring-service.ts
                                 Supabase-backed scenario, evidence, ledger, and idempotency flow
server/supabase.ts                Server-only Supabase client
supabase/migrations/              Versioned Postgres schema
docs/                             PRD, architecture, visual direction, and asset records
```

The detailed implementation plan is intentionally maintained outside this public repository.

## Deployment note

The repository produces a working production bundle with `pnpm build`. For the current project, use the built-in publish flow after saving a checkpoint. If deploying independently on Vercel Hobby, configure the same server and browser environment variables and verify the Express/tRPC runtime model before publishing.

## References

[1]: https://console.groq.com/docs/tool-use/local-tool-calling "Groq Local Tool Calling"
