# AgriGuard demo video guide

## Use this guide

This guide is for the teammate who records the AgriGuard demo video. Read the speaking lines once before you record. Use the public demo at [agriguard-eta.vercel.app](https://agriguard-eta.vercel.app).

Keep the final video between **2 minutes 40 seconds** and **2 minutes 55 seconds**. The submission limit is three minutes.

## What the hackathon project is

AgriGuard was built for the **FortyGuard Global AI Hackathon 2026**. The project is submitted under **Track 6: Agentic AI**.

The project is a parametric wheat heat-cover prototype. It turns field temperature observations into a fixed heat decision and stored evidence. The ledger shows a simulated payout entry. The AI agent retrieves completed evidence and explains it. The policy engine calculates the result.

Heat can damage wheat in a short period. An insurer or reviewer needs the facts behind a recorded decision. AgriGuard keeps those facts in one review flow.

## Facts to know before you record

| Item | Say this accurately |
| --- | --- |
| FortyGuard role | FortyGuard provides the hourly field temperature observations. |
| Demo location | A public 2023 California Department of Water Resources wheat polygon in Fresno County, California. |
| Time window | 15 July 2024, from 12:00 to 14:00 UTC. |
| FortyGuard readings | 35.2 °C, 36.3 °C, and 37.7 °C. |
| Policy trigger | Wheat in flowering or grain fill needs at least three continuous hourly readings at or above 34 °C. |
| Demo result | A 25% simulated payout band and a $6,250 simulated amount. |
| AI boundary | Groq writes the explanation after the rule engine completes the record. It cannot alter the result. |
| Scope | The public crop polygon is a demo boundary. The prototype does not issue insurance or transfer money. |

## Routes to prepare

Open these pages before you record. Wait for each page to load.

1. `https://agriguard-eta.vercel.app/`
2. `https://agriguard-eta.vercel.app/app`
3. `https://agriguard-eta.vercel.app/app/fields/north`
4. `https://agriguard-eta.vercel.app/app/evidence/LIVE-FRESNO-2024071514`
5. `https://agriguard-eta.vercel.app/app/ledger`

Use the verified evidence record. Do not press a live-monitoring control during the recording. A new request can delay the video and does not improve the story.

## Three-minute recording plan

| Time | Show on screen | Speak | Do next |
| --- | --- | --- | --- |
| 0:00–0:20 | Landing page | “Heat can damage wheat within a few hours. A parametric policy needs a trigger that a reviewer can read. AgriGuard turns hourly temperature observations into a recorded heat decision.” | Click **Open the live demo**. |
| 0:20–0:40 | Portfolio at `/app` | “AgriGuard uses FortyGuard for field temperatures. This portfolio shows a verified event for a public Fresno County wheat boundary. The boundary is used only for this demo.” | Open the Fresno field or go to the prepared field tab. |
| 0:40–1:05 | Field detail at `/app/fields/north` | “For 15 July 2024, FortyGuard returned 35.2, 36.3, and 37.7 degrees Celsius for three continuous hours. The policy trigger is 34 degrees during flowering or grain fill.” | Open the verified evidence record. |
| 1:05–1:45 | Evidence page at `/app/evidence/LIVE-FRESNO-2024071514` | “This is the evidence record. It shows the source, the hourly readings, the fixed rule, and the recorded decision. The rule produces a 25 percent simulated payout band, with a simulated amount of 6,250 dollars.” | Scroll slowly through the observed, rule, and recorded sections. |
| 1:45–2:05 | Agent explanation on the evidence page | “The agent writes a plain-English explanation after the evidence record exists. The agent cannot change a policy result or approve a payment.” | Keep the explanation visible for two seconds. |
| 2:05–2:25 | Ledger at `/app/ledger` | “The ledger records the simulated payout event. A stable idempotency key stops a repeated monitoring run from creating a duplicate event.” | Keep the simulated label visible. |
| 2:25–2:50 | Ledger or evidence page | “AgriGuard is submitted to the Agentic AI track. It uses FortyGuard for observations and a controlled AI agent for explanation. Every payment shown in this prototype is simulated.” | Stop the recording after a short pause. |

## Recording setup

1. Use a desktop browser window at 1280 pixels or wider.
2. Close unrelated tabs, messages, and notifications.
3. Hide the bookmarks bar.
4. Use a clear voice recording. Do not add background music.
5. Record at 1080p and 30 frames per second if your recorder has these settings.
6. Keep the cursor still while you speak.
7. Use one continuous take. Record a second take as backup.

## Important words to use

Say **verified FortyGuard observations** for the Fresno event. Say **simulated payout** every time you mention an amount. Say **public demo boundary** for the Fresno wheat polygon.

Do not call the public polygon an insured farm. Do not say that the AI decides the payout. Do not say that AgriGuard pays money or sells insurance.

## If the verified record does not load

Open `https://agriguard-eta.vercel.app/app/evidence/DEMO-042`.

State this before you show the result: “This is the synthetic backup path. It is not verified FortyGuard data.” Then explain the same fixed policy rule and the simulated-payout boundary.

## Short answers for questions after the video

| Question | Answer |
| --- | --- |
| Is the payout real? | No. Every amount is simulated. |
| Does AI decide the payout? | No. The fixed policy engine calculates the result. The AI agent explains completed evidence. |
| Why use FortyGuard? | FortyGuard provides the hourly temperature observations for the recorded heat event. |
| Why Fresno County? | The project uses a public wheat polygon as a stated demo boundary. |
| What does AgriGuard add? | It keeps the source data, policy rule, and recorded result together for review. |

## Source notes

The demo facts and route sequence are documented in the [public project README](README.md) and the [FortyGuard integration notes](docs/FORTYGUARD_API_INTEGRATION_NOTES.md). The shorter rehearsed judge flow is in [docs/HACKATHON_JUDGE_DEMO.md](docs/HACKATHON_JUDGE_DEMO.md).
