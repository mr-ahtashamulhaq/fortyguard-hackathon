# AgriGuard Frontend Direction

## Purpose

AgriGuard has two different surfaces. The landing page persuades a hackathon judge that the product is credible, clear, and memorable. The application helps a portfolio manager or claims reviewer inspect a simulated decision without ambiguity.

The landing page must make one point quickly: **heat risk becomes an evidence record, not a black-box decision.** The application must make the evidence readable enough to audit.

## Design thesis

> AgriGuard is a field ledger under changing weather: the landscape can move, but the rule and its evidence stay fixed.

The design avoids generic insurance blue, generic AI gradients, dashboard-card overload, fake proof, and financial language that implies a real payment. The expressive element is one living weather object in the landing hero. The product application remains calm and precise.

## Brand system

| Role | Name | Light value | Dark value | Use |
|---|---|---:|---:|---|
| Ink | Canopy | `#10221D` | `#F1F5EE` | Main headings and long-form text |
| Field | Growth | `#2E6B55` | `#78B98B` | Active controls and stable positive states |
| Water | Gauge | `#2B7DAA` | `#72BFE5` | Data sources, links, and active location markers |
| Heat | Exposure | `#C85A2B` | `#F28B55` | Triggered state and policy threshold emphasis |
| Watch | Harvest | `#B58124` | `#F2C96E` | Watch state and caution notes |
| Ground | Mineral | `#F3F5EF` | `#0B1713` | Page background |
| Paper | Record | `#FCFDF9` | `#11221C` | Evidence sheets and panels |
| Rule | Survey line | `#D7DED4` | `#294137` | Borders, map grid, and quiet dividers |

The landing page uses a **committed field-and-water palette**. The application uses a **restrained record palette**. Heat orange appears only when a condition reaches the policy threshold; it is never a decorative accent.

## Typography

Landing headings use **Bricolage Grotesque** with a compact line height. The face has enough character to make the landing hero memorable without turning the product into a lifestyle brand. Body copy uses **Manrope** for reliable reading. Evidence times, rule values, temperature readings, and payout identifiers use **Azeret Mono**.

The application uses Manrope for task labels and Azeret Mono for figures and audit data. It does not use a display font inside tables, forms, or charts.

## Surface architecture

| Route | Mode | Primary visitor | Job | Defining moment |
|---|---|---|---|---|
| `/` | Persuade | Hackathon judge | Understand why a deterministic decision layer matters and open the demo. | The 34 °C rule sits beside a living, reactive weather object. |
| `/app` | Operate | Portfolio manager | Scan field risk and run the demo scenario. | A clear field register and map show what needs attention. |
| `/app/fields/:fieldId` | Operate | Claims reviewer | Inspect readings, policy test, and heat score. | The chart and rule show the exact moment the event qualified. |
| `/app/evidence/:evidenceId` | Read | Claims reviewer and judge | Trace a decision without reading source code. | A print-like evidence sheet shows source, input, rule, result, and explanation. |
| `/app/ledger` | Operate | Claims reviewer | Review and record simulated payout events. | A ledger table makes every simulated payout visibly non-financial. |

## Landing-page composition

The landing page uses a 12-column grid. A narrow fixed header has the wordmark, an **Open demo** action, and the theme control. The first viewport is split: copy and the fixed policy line sit on the left; the approved Spline scene occupies the right. The hero does not use a generic screen mockup.

The first view contains the headline **“When heat crosses the line, the evidence is already waiting.”** The supporting copy names the real product boundaries: wheat fields, a 34 °C threshold, three continuous hours, transparent simulated payouts. The main action opens `/app`; a secondary action scrolls to the policy section.

The remaining landing sequence is intentionally short:

1. **Heat becomes evidence.** The user-supplied aerial video sits in a wide, quiet section with a small source label.
2. **A fixed policy, shown plainly.** Three parts show observation, rule, and record.
3. **A decision that can be inspected.** A small evidence-sheet preview shows observations, threshold, reasoning, and simulated result.
4. **A safe monitoring agent.** The section explains that the agent retrieves and explains evidence; it does not set policy or payout values.
5. **Open the demo.** One clear invitation to the working dashboard with the simulated-payout disclaimer.

## Application composition

The application is a field-operations workspace, not a marketing site. It uses a compact top bar, thin rule lines, large readable data, and evidence sheets rather than many floating cards. The left navigation uses short labels: **Portfolio**, **Evidence**, and **Ledger**. It does not require user login for the hackathon demo.

The Portfolio view pairs a field register with a Leaflet map. Each row includes the status word, last observation time, crop stage, and source. The main monitoring action is in the top bar. The synthetic demo state is a persistent text label, not a hidden toast.

The Field view puts the temperature chart first, the heat-score chart second, and the policy test beside them. The 34 °C threshold is a strong but narrow orange line. Qualifying readings use a text label and a shape in addition to color.

The Evidence view looks like a readable record: source label, policy version, observations, exposure time, heat score, payout band, simulated amount, explanation, and audit entries. The Payout Ledger uses a real table structure and a fixed disclaimer above it.

## Approved component scope

| Component | Use | Decision |
|---|---|---|
| Theme control | Fixed header and app bar | Use the supplied symbol with an adapted no-blur circular transition. |
| Spline scene | Landing hero only | Dynamically load the approved public Code scene. Never render in the application. |
| User-supplied field video | Landing evidence section only | Load after viewport entry. Do not autoplay under reduced motion. |
| AI Orb Face | Monitoring or evidence-generation state | Show an accessible text state beside the orb. Disable gaze for small instances. |
| AI Loader grid | Short waiting state | Use a polite status region and real elapsed time. Never show invented percentages. |
| AI Prompt Input | Not used | There is no chat panel in the first release. |
| Map | Portfolio view | Leaflet and OpenStreetMap only. |
| Charts | Field detail | Recharts temperature and heat-score charts only. |

## Motion and performance contract

Lenis runs on the landing page only. GSAP and ScrollTrigger control no more than four coordinated landing moments: hero copy, policy sequence, video frame, and closing action. The application uses short CSS or Framer Motion transitions only.

The theme transition uses `document.startViewTransition` when supported. It starts from the theme button’s measured center, uses a circle reveal without blur, and changes instantly for reduced-motion users or unsupported browsers.

The supplied theme-transition reference confirms the circle variant, no blur, and the View Transition API as the requested behavior. The implementation will derive the clip-path origin from the actual theme-button bounds rather than assuming a fixed corner or center.

The Spline component loads only when the hero is near the viewport. It has a CSS fallback that remains visible until the scene is ready. The Spline scene is not loaded on small or reduced-motion devices. The Pexels video is also deferred and uses its poster image if data saver, reduced motion, or a slow connection is detected.

The public Spline Code scene is not approved for the released landing page because it displays third-party wording and a `Built with Spline` badge. The landing hero will use a branded Magic UI Globe implementation with its own field-signal palette and the same static fallback rules. The globe is a replacement, not an additional 3D runtime.

The landing page will use a custom smooth cursor only for hover-capable, motion-permitted desktop visitors. Native pointers remain visible in forms, keyboard flows, touch devices, and the application workspace. A small Ripple effect will sit behind the 34 °C policy threshold only. A three-item adapted Motion FAQ will sit near the landing-page close.

There will be no blocking full-screen preloader. The visible hero copy and CSS signal fallback render immediately. The 3D globe loads independently in the background, which produces a faster first paint and makes loading state truthful. A small in-context `Preparing field signal` indicator may appear only inside the hero visual while the globe initializes.

No animation may change width, height, padding, margin, top, left, or box shadow on every frame. Motion uses transform and opacity. Every in-view animation must use one observer or one GSAP timeline; it must not create per-card scroll listeners.

The re-confirmed performance guardrails are: defer 3D and video until needed, keep offscreen effects unmounted, use one coordinated scroll system rather than many listeners, avoid unnecessary React state during animation, and prefer `requestAnimationFrame` for any unavoidable custom frame work.

## Responsive rules

| Width | Landing behavior | Application behavior |
|---:|---|---|
| 1440 px and above | Full split hero; Spline visible; 12-column content grid. | Two or three information columns, persistent field register. |
| 1024 px | Hero keeps split composition with smaller Spline region. | Map and register remain side by side when practical. |
| 768 px | Hero becomes vertically sequenced; video remains full width. | Map moves above the register and panels stack. |
| 375 px | Spline is replaced by its static fallback. Copy and actions remain above the fold. | Essential status, evidence, and primary action remain visible; charts scroll horizontally only when labelled. |

## Content and safety rules

The words **simulated payout** appear in the landing-page evidence section, every evidence record, and the ledger. The words **Synthetic demo data** appear in every affected view during the heat-wave scenario. The data-source label appears on every evidence record.

No customer review, user rating, insurer partnership, payout success rate, or unsupported performance claim may appear in the design.
