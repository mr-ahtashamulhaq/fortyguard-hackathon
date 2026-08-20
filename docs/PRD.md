# Product Requirements Document: AgriGuard

**Product:** AgriGuard  
**Version:** 1.0  
**Status:** Approved for implementation  
**Product type:** FortyGuard Hackathon prototype

## 1. Product summary

AgriGuard is a parametric crop-insurance prototype for wheat fields. It monitors temperature data, applies a fixed heat policy, and creates a transparent simulated payout record.

The product shows each decision from the field reading to the payout ledger. Every payout is simulated. The product does not issue insurance or send money.

## 2. Problem

Heat stress can damage wheat during flowering and grain filling. Traditional crop claims can take time because a human must collect and assess evidence.

AgriGuard shows how a fixed policy rule can create a faster, traceable decision. The product keeps the decision rule separate from the AI explanation.

## 3. Product goals

| Goal | Success condition |
|---|---|
| Show transparent decisions | A judge can open an evidence record and see the readings, rule, score, and simulated payout band. |
| Use real temperature data | The application reads field observations from FortyGuard when the API is available. |
| Show Agentic AI safely | A Groq agent uses allow-listed server tools but cannot change a policy result. |
| Give a reliable demo | A fixed heat-wave scenario completes the full field-to-ledger flow without external data. |
| Keep the scope focused | The first release supports wheat, heat stress, three to five fields, and simulated payouts only. |

## 4. Users

| User | Need | Main product view |
|---|---|---|
| Portfolio manager | See which fields need attention. | Portfolio dashboard |
| Claims reviewer | Understand why a payout was triggered. | Evidence record and payout ledger |
| Hackathon judge | See a complete, safe, and repeatable product flow. | Demo scenario and evidence record |

## 5. Product scope

### In scope

The initial release includes a portfolio dashboard, a field-detail view, a deterministic heat policy engine, a Groq monitoring agent, evidence records, a simulated payout ledger, FortyGuard data ingestion, a Supabase database, and a synthetic heat-wave demo.

### Out of scope

The initial release does not include real payments, a legally binding insurance policy, user onboarding, farmer personal data, multiple crops, frost cover, satellite data, model training, or continuous background polling.

## 6. Policy rules

The policy engine is the source of truth for every decision. The following rule is a hackathon demonstration rule. It is not a real insurance contract.

| Rule item | Requirement |
|---|---|
| Crop | Wheat only |
| Eligible growth stages | `flowering` or `grain_filling` |
| Temperature threshold | 34 °C or more |
| Observation interval | One normalized reading per hour |
| Continuous exposure | Three or more consecutive qualifying hourly readings |
| Event break | A reading below 34 °C, a missing hourly reading, or an ineligible growth stage breaks the event. |
| Heat score | The sum of `max(0, temperatureC - 34)` for each reading in the longest qualifying event. |
| 25% payout band | Three or four continuous qualifying hours |
| 50% payout band | Five or six continuous qualifying hours |
| 100% payout band | Seven or more continuous qualifying hours |
| No payout | Less than three qualifying hours, an ineligible growth stage, or unavailable data |

The engine must save the rule version with every evaluation. This record makes past decisions traceable if the rule changes later.

## 7. Functional requirements

### 7.1 Portfolio dashboard

The dashboard must show three to five wheat fields on a Leaflet map that uses OpenStreetMap tiles. The dashboard must also show the fields in a list.

Every field must have one status: **Safe**, **Watch**, **Triggered**, or **Data unavailable**. The status must have text and a color. The application must not use color as the only status indicator.

| Status | Meaning |
|---|---|
| Safe | No active qualifying heat event exists. |
| Watch | A field has one or two continuous qualifying hours. |
| Triggered | A qualifying heat event has reached three continuous hours. |
| Data unavailable | The latest reading is missing or older than the configured freshness limit. |

The initial freshness limit is four hours. The server must keep this value in one configuration location.

### 7.2 Field-detail view

The field-detail view must show the field name, coverage amount, growth stage, current status, data source, and latest observation time.

The view must contain a Recharts temperature chart. It must show a horizontal threshold line at 34 °C. It must highlight qualifying readings.

The view must also contain a heat-score chart. It must show the running heat score for the selected evaluation window.

### 7.3 Deterministic heat policy engine

The server must provide one reusable policy engine. It must accept a field, a policy, and normalized observations.

The engine must return a structured evaluation. The evaluation must include the status, longest exposure, heat score, payout band, simulated payout amount, qualifying readings, and reasons.

The engine must not call Groq. The engine must give the same output for the same input.

### 7.4 Monitoring agent

The Groq agent must use controlled server tools. It can request a field, observations, an evaluation, an evidence record, and a simulated payout action.

Groq supports local function tool calling. The application code executes the requested tool and returns structured results to the model. [1]

The agent must not receive direct database credentials. The agent must not alter a threshold, a crop stage, a payout band, or a payout amount.

The agent must create an explanation record with this stable shape:

```ts
type EvidenceExplanation = {
  source: "groq" | "template";
  headline: string;
  summary: string;
  reasons: string[];
  recommendedAction: string;
  disclaimer: string;
};
```

If Groq returns an error, reaches its limit, or returns invalid data, the server must create a template explanation that has the same shape.

### 7.5 Evidence record

The evidence view must show the qualifying observations, threshold value, exposure hours, heat score, payout band, simulated payout amount, data-source label, explanation, and policy-rule version.

The view must show the exact observation times and temperatures. A user must be able to understand why the status was created without reading source code.

### 7.6 Simulated payout ledger

The ledger must list each triggered event with the field name, event date, payout band, simulated amount, and status.

The only ledger status actions are **Reviewed** and **Recorded**. Both actions must create an audit entry. The UI must show a simulated-payout disclaimer in the ledger header and each payout-detail view.

### 7.7 Heat-wave scenario

The application must provide a **Run heat-wave scenario** control. The control must add fixed synthetic temperature observations for one approved demo field.

The synthetic scenario must create a qualifying event and a simulated payout. Every affected dashboard card, field view, evidence record, and ledger row must show **Synthetic demo data**.

### 7.8 Data sources

FortyGuard Temperature API data is the primary source for temperature observations. The server must label the source as `fortyguard`.

The heat-wave scenario is a separate source. The server must label it as `synthetic_demo`. The UI must display a readable label for both sources.

### 7.9 Data storage

The AgriGuard Supabase project will store these records after the schema is approved:

| Record | Purpose |
|---|---|
| Fields | Wheat-field location, name, and current growth stage |
| Policies | Coverage amount, policy period, and rule version |
| Temperature observations | Normalized readings and source labels |
| Heat evaluations | Deterministic engine output |
| Evidence records | Observations, calculations, and explanation records |
| Payout events | Simulated payout state and amount |
| Audit entries | Immutable action history |

Supabase provides a hosted Postgres database for this application. [2]

### 7.10 Duplicate prevention

The application must prevent two payout events for the same policy and event window. The server must use a database uniqueness constraint and an engine-level idempotency key.

If a duplicate request occurs, the server must return the existing payout event. The server must not create a second ledger row.

### 7.11 Safety and fallback behavior

| Condition | Required behavior |
|---|---|
| Missing observation | Set field status to Data unavailable. Do not create a payout. |
| Stale observation | Set field status to Data unavailable. Do not create a payout. |
| FortyGuard API error | Show the last stored observation time. Do not treat the error as a heat event. |
| Groq error | Create the structurally equivalent template explanation. |
| Duplicate payout request | Return the existing payout event. Do not insert another row. |
| Synthetic data active | Show the Synthetic demo data label in every affected view. |

## 8. Non-functional requirements

| Area | Requirement |
|---|---|
| Security | Keep Supabase service keys, FortyGuard keys, and Groq keys on the server. |
| Explainability | Save the policy input, rule version, output, source, and explanation source. |
| Accessibility | Use text labels, keyboard-accessible controls, visible focus states, and adequate color contrast. |
| Performance | Load the dashboard and field view from stored Supabase data. Do not call external services during every render. |
| Reliability | The demo scenario and template explanation must work when external APIs are unavailable. |
| Testing | Unit-test the policy engine, data-unavailable rules, payout idempotency, and explanation shape. |

## 9. Acceptance scenarios

| ID | Scenario | Acceptance condition |
|---|---|---|
| AC-01 | Safe field | A field with no qualifying observation shows Safe. |
| AC-02 | Watch field | A field with one or two continuous qualifying hours shows Watch. |
| AC-03 | Triggered field | A flowering or grain-filling field with three qualifying hours creates a 25% simulated payout. |
| AC-04 | Payout band | Five qualifying hours creates a 50% payout. Seven qualifying hours creates a 100% payout. |
| AC-05 | Ineligible stage | A vegetative-stage field cannot create a payout even if temperatures exceed 34 °C. |
| AC-06 | Missing data | A field with a missing hourly reading shows Data unavailable and cannot create a payout. |
| AC-07 | Agent fallback | A Groq error creates a template explanation with all required explanation fields. |
| AC-08 | Duplicate request | A repeat request returns the existing payout event and does not create a second ledger row. |
| AC-09 | Synthetic demo | The heat-wave control shows Synthetic demo data in all affected views. |

## 10. Demo success criteria

The full judge demo must take less than three minutes. A judge must see a field change from Safe to Triggered, inspect the evidence, read the agent explanation, and see the simulated payout ledger entry.

The demo must still work if the FortyGuard API or Groq is unavailable. The user must be able to run the labeled synthetic heat-wave scenario and view a template explanation.

## 11. Assumptions

The first version uses hourly normalized temperature observations. The first version runs monitoring on user action. A scheduled monitoring task can be added after the hackathon.

The team will use the Supabase `agri-guard` project in the `ap-south-1` region. The project does not contain AgriGuard application tables at this stage.

## 12. References

[1]: https://console.groq.com/docs/tool-use "Groq Tool Use"

[2]: https://supabase.com/docs/guides/database/overview "Supabase Database Overview"
