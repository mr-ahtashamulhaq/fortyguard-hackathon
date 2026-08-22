# FortyGuard Quota Exercise — 2026-08-22

## Scope

The user reported one of 30 heatmaps used before this exercise. AgriGuard then submitted controlled monitoring requests only for the documented public Fresno County wheat demo boundary.

Each monitoring request asks FortyGuard for three historical hourly temperature heatmaps. The policy engine then evaluates the same fixed 34 °C, three-continuous-hour wheat rule.

## Test Traffic

| Group | Monitoring requests | Heatmap submissions | Result |
| --- | ---: | ---: | --- |
| Pilot | 1 | 3 | Completed and persisted. |
| Concurrent batch 1 | 3 | 9 | All completed and persisted. |
| Concurrent batch 2 | 3 | 9 | All completed and persisted. |
| Concurrent batch 3 | 2 | 6 | All completed and persisted. |
| Final request | 1 | 3 | Completed and persisted. |
| **Total submitted by AgriGuard** | **10** | **30** | **All completed successfully.** |

The FortyGuard API accepted all 30 submitted heatmaps. Each completed task has its own FortyGuard activity ID. FortyGuard states that credits are deducted only after a task reaches `Completed` status.[1]

## Post-Run Account Usage

The official FortyGuard credit-usage endpoint was read after the exercise. The active Hackathon account showed the following billing-cycle totals:

| Measure | Post-run value |
| --- | ---: |
| Total available credits | 2,000,000 |
| Credits used in the billing cycle | 185,680 |
| Credits remaining in the billing cycle | 1,814,320 |
| Heatmap-generation tasks in the billing cycle | 44 |

The documented usage endpoint reports billing-cycle totals, not the dashboard's daily heatmap counter.[2] The user reported one of 30 daily heatmaps before the exercise. AgriGuard then completed 30 additional heatmap tasks. The provider did not reject the final request, so the API did not enforce a hard 30-task daily stop during this test. The project-level evidence proves 30 completed requests; it does not claim an unobserved dashboard daily total.

## Verified Result

All completed runs returned the same verified historical observations from the public Fresno demo boundary:

| UTC hour | Mean field temperature |
| --- | ---: |
| 12:00 | 35.2 °C |
| 13:00 | 36.3 °C |
| 14:00 | 37.7 °C |

The deterministic evaluation remained unchanged: three qualifying continuous hours, 7.2 degree-hours, and a **25% simulated payout band** of **$6,250 simulated**. No real payment was created or attempted.

## Persistence and Idempotency Readback

The public project API was read after the quota exercise. The portfolio still identified the source as FortyGuard. The verified evidence record remained `LIVE-FRESNO-2024071514`.

The ledger contained one live FortyGuard payout key for that event and one separate, older synthetic demo payout key. Repeated live monitoring did not create duplicate live payout events. This confirms that the idempotency key held across the concurrency exercise.

## Boundary and Safety Note

The Fresno geometry is a public crop-map polygon used only for the hackathon demonstration. It is not a real insured-party boundary. All displayed amounts remain explicitly simulated.

## References

[1] [FortyGuard Quickstart — task completion and credit deduction](https://docs-api.fortyguard.com/docs/quickstart)

[2] [FortyGuard Check API Credits Usage](https://docs-api.fortyguard.com/docs/credits-usage)
