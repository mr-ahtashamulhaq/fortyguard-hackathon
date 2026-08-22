# FortyGuard Daily Quota Exercise — 2026-08-22

## Starting Point

The user’s FortyGuard dashboard showed two of 30 daily heatmaps created and 28 remaining. The goal was to use the remaining 28 daily heatmaps without changing AgriGuard’s fixed policy rule, public Fresno demo boundary, or simulated-payout safeguards.

## Important Correction

The first repeated monitoring requests reused the same three historical hours. Although FortyGuard returned new activity IDs, those repeated requests did not provide a reliable way to move or verify the dashboard’s daily **created heatmaps** counter.

The final exercise therefore used 28 distinct single-hour historical requests for the documented public Fresno wheat polygon. The requests covered 2024-07-10 00:00 UTC through 2024-07-11 03:00 UTC.

## Result

| Measure | Result |
| --- | --- |
| Distinct historical heatmaps requested | 28 |
| Completed | 28 |
| Failed | 0 |
| Polygon | Public Fresno County wheat demo polygon, California DWR UniqueID 1011953 |
| Direct effect on AgriGuard payout ledger | None |
| Daily-counter target | 28 requests, matching the user-reported remaining amount |

The official account usage endpoint increased from 44 recorded heatmap-generation tasks before this corrected exercise to 102 after it. The 58-task difference includes 30 earlier repeated requests and the 28 distinct requests above. The 28 distinct activity IDs and their completed temperatures are saved outside the repository to avoid committing bulk raw service output.

The provider’s current-day custom-range endpoint then returned 91 heatmap-generation tasks for 2026-08-22 UTC. This does not match the dashboard’s reported 2/30 starting value, so the two provider views use different counting scopes or update timing. The exercise therefore proves 28 distinct completed requests, but does not claim that the dashboard view itself was independently read after refresh.

## Boundary Verification

FortyGuard’s documented usage endpoint reports billing-cycle activity totals, and its custom-range response does not match the dashboard’s daily created-heatmaps value.[1] The exact dashboard total must therefore be refreshed in the user’s FortyGuard dashboard. No additional request is made after the 28 distinct completions because the user’s reported 2/30 starting position plus 28 completed distinct requests reaches the requested 30/30 target.

## AgriGuard Readback

The direct quota runner did not call the AgriGuard monitoring mutation, so it did not write to the application database. A post-exercise readback confirmed that `LIVE-FRESNO-2024071514` still exists and that the ledger contains exactly one row for its live FortyGuard payout key. The existing 25% result remains simulated.

## Safety Note

These requests tested only public historical temperature data for the documented demo polygon. They created no real insurance policy, payment, or payout. AgriGuard’s existing record remains a 25% **simulated** result.

## Reference

[1] [FortyGuard Check API Credits Usage](https://docs-api.fortyguard.com/docs/credits-usage)
