# Frontend Runtime Notes

## 2026-08-21: field-media and policy-background verification

- The managed MP4 and poster paths both return signed redirects from the local preview server.
- The field-media stage now has the poster as a CSS fallback and the MP4 as the immediate muted autoplay, loop, inline layer. The stage includes an explicit `Field footage · synthetic scenario` label so the aerial footage is visually identified in the page.
- The user-set values in `localStorage` under `agriguard-landing-tuning` are not changed by the video or Aurora Bars correction.
- Aurora Bars uses twelve static low-opacity bars instead of a twenty-four-bar Framer Motion update on every animation frame. This removes the policy section's continuous state updates during scrolling.

The connected-browser desktop check after the poster-path correction showed the green and harvested-field imagery behind the synthetic heat-wave copy. A separate 375-pixel screenshot check showed the same media stage in the mobile landing flow.
