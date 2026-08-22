# AgriGuard Judge Demo

## Purpose

This is the 75-second judge demo for AgriGuard. It shows one complete path: **FortyGuard observation → fixed policy rule → simulated decision → auditable evidence**.

The demo uses a public Fresno County wheat polygon. It is a product demonstration, not a real insured field. Every payout shown is simulated.

## Judge Story

| Time | Screen | What to say | What the judge must understand |
| --- | --- | --- | --- |
| 0–8 seconds | Landing page | “Heat damage is hard to insure when the trigger is unclear. AgriGuard turns temperature evidence into a clear, reviewable wheat heat decision.” | The product solves a real trust problem. |
| 8–18 seconds | Portfolio | “This portfolio uses verified FortyGuard observations for a public Fresno wheat field. The event is already stored, so the operations team can review it.” | The weather source is real and the flow is operational. |
| 18–30 seconds | Field detail | “The field reached 35.2, 36.3, and 37.7 degrees Celsius in three continuous hours. The policy trigger is 34 degrees for three continuous hours during an eligible wheat stage.” | The policy rule is exact and deterministic. |
| 30–52 seconds | Evidence record | “This page shows why the decision exists. The observations come first. The fixed rule comes second. The recorded result is a 25 percent simulated payout band. The agent explains the evidence, but it cannot change the rule or payout.” | The agent has a useful but controlled role. |
| 52–65 seconds | Observation cells and agent explanation | “Every reading, timestamp, policy version, and explanation stays with this record. A reviewer does not need to trust a black box.” | The result is auditable. |
| 65–75 seconds | Ledger or evidence result | “AgriGuard does not promise a real payment. It creates the transparent evidence layer needed before a parametric wheat payout is reviewed. That is the decision gap we close.” | The scope is honest and the value is clear. |

## Spoken Script

> Heat damage is hard to insure when the trigger is unclear. AgriGuard turns temperature evidence into a clear, reviewable wheat heat decision. This portfolio uses verified FortyGuard observations for a public Fresno wheat field. The event is already stored for review. The field reached 35.2, 36.3, and 37.7 degrees Celsius in three continuous hours. Our fixed policy trigger is 34 degrees for three continuous hours during an eligible wheat stage. This record shows the full decision chain: observed heat, applied rule, and recorded 25 percent simulated payout band. The AI agent explains the evidence, but cannot change the policy or payout. Every source, timestamp, and policy version stays with the record. AgriGuard does not move money. It creates the transparent evidence needed before a parametric wheat payout is reviewed.

## Recording Runbook

### Primary Recording

Open the following routes in this order. Wait for each route to finish loading before you record it.

1. Open `/` for the product context.
2. Open `/app/portfolio` for the stored FortyGuard event.
3. Open `/app/fields/north` for the event readings and policy status.
4. Open `/app/evidence/LIVE-FRESNO-2024071514` for the decision chain.
5. Open `/app/ledger` for the simulated payout review record.

Use the stored evidence record. Do not use the live-monitoring button during the recorded pass. A new FortyGuard request can add delay and does not improve the judge story.

Record one continuous 75-second take. Then record a second take that starts directly on the evidence record. The second take is the fallback clip.

### Preflight

| Item | Required state |
| --- | --- |
| Server | The local preview is open and responds. |
| Data source | The portfolio says `Verified FortyGuard data`. |
| Evidence record | `LIVE-FRESNO-2024071514` loads with the 25% simulated band. |
| Policy proof | The evidence chain shows three continuous hours above 34 °C and an eligible grain-filling stage. |
| Simulation label | `Simulated decision` and `$6,250 simulated` are visible. |
| Browser | Use a clean window at desktop width. Hide bookmarks and unrelated tabs. |
| Audio | Record one clear voice track. Do not add background music. |

### Fallback If the Live Record Does Not Load

Open `/app/evidence/DEMO-042`. State that this is the synthetic backup path before you discuss its result. Do not call it verified data. Keep the same explanation of policy controls and simulated payouts.

## Evidence Route Safety

The verified record at `/app/evidence/LIVE-FRESNO-2024071514` was checked in the browser. It shows the verified source, the 25% simulated band, and the observed-rule-result chain.

The missing-record route was also checked. It shows `Verified evidence is unavailable` and no synthetic policy result. The synthetic backup remains available only at `/app/evidence/DEMO-042`.

## Judge Questions and Short Answers

| Question | Answer |
| --- | --- |
| Is this a real insurance payout? | No. Every amount is simulated. The prototype creates a reviewable decision record. |
| Does AI decide the payout? | No. A fixed policy engine decides the payout. The AI agent retrieves and explains evidence only. |
| Why use FortyGuard? | FortyGuard provides the temperature observations that support the recorded heat event. |
| Why is this field in California? | The prototype uses a public Fresno County wheat polygon as a transparent demo boundary. It is not a legal insured boundary. |
| What is the product difference? | It makes a parametric trigger visible: source data, rule, result, and explanation stay together. |
