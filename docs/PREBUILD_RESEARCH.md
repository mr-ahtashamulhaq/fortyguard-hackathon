# Pre-build Research Notes

## User direction

The project will use separate landing and application experiences. Both experiences need light and dark themes. The user requests a high-design, fast, animated presentation suitable for a hackathon judge demo.

The landing page can use smooth scrolling, scroll-based motion, and one performance-conscious 3D hero element. The application must favor clear data, readable policy evidence, and controlled AI status feedback.

## Supplied component references

| Reference | Approved role | Accessibility and performance rule |
|---|---|---|
| AI Orb Face | Agent state in an optional monitoring conversation or evidence-assistant panel | Include a text label when it is the only status indicator. Disable gaze, blinking, and other motion with reduced-motion preferences. |
| AI Prompt Input | Use only if the product includes a conversational agent panel | Keep the composer visually stable while text is entered. Use a labelled send or stop control. |
| AI Loader grid | Pending monitor or agent status | Use a polite status region. Show elapsed time, not invented progress. |
| Theme Toggle button | Global theme-control icon | Reuse only after its supplied code and dependencies are reviewed. |
| Theme Toggle animation | Theme-transition reference | Use a circle reveal without blur. Start the reveal from the actual toggle position. Respect reduced-motion preferences. |

## Motion and performance rules

Use transform and opacity for animation. Do not animate layout properties, persistent shadows, or large offscreen 3D elements. Initialize visual work on viewport entry. Keep a small number of coordinated motion systems.

Use a static fallback for the 3D hero on constrained devices, low-power devices, or reduced-motion preferences. Do not render offscreen 3D content.

## Initial design direction

Use a trust-first field-operations system: water blue, field green, warm alert amber, and charcoal. Use a clear sans-serif font and a dense but readable information grid. Avoid generic purple AI gradients, decorative proof claims, and fake financial language.

## Theme-toggle review

The supplied icon has a compact light-dark symbol and can be adapted for the header. The supplied transition relies on the View Transitions API and `next-themes`, while this project uses a React and Vite theme provider.

The approved adaptation is a no-blur circular view transition that starts at the measured center of the header theme button. Browsers without View Transitions will change theme instantly. Reduced-motion users will also receive an instant change.

The supplied demo wrapper, draggable settings panels, remote GIF variants, and Next.js-specific `useTheme` hook are not suitable for the product. They will not be added.

## Spline decision

Spline supports React and its Viewer is a native web component. The Viewer lazy-loads visible canvas content by default. Spline recommends one or two embeds per page and recommends a simple scene with reduced polygons, materials, textures, lights, and post-processing. [1] [2]

The landing page will reserve a single, lazy-loaded Spline hero scene. It will not use Spline inside the operational application. The scene will require a public Spline scene URL before it can be added. A static image or video fallback will load for reduced-motion and constrained-device modes.

The connected browser already has an active Spline workspace, so no login is required. The workspace shows existing generic scenes, but no approved AgriGuard scene. Creating or generating a new scene can consume Spline workspace credits or use account-specific limits. We will not create a new scene until the user approves the proposed scene concept and any available Spline usage notice.

The Spline Community gallery is available in the connected workspace without another login. It provides categories for interactive design, materials, particles, 3D mockups, and product design, plus search and popularity sorting. Public cards load dynamically, so the next review step is to use the gallery search and inspect individual public elements for their copy or remix controls and public export details.

The loaded community feed shows several non-sector-specific candidates. The initial shortlist is a Reactive Orb, Clarity Stream, or one small glass-icon scene. The hero decision will prefer an abstract data-and-weather visual that is compact and recognizable, rather than a robot, rocket, or full interactive landing-page scene that competes with AgriGuard content.

The search confirms that the original Reactive Orb by `vladkolokolnikov` is the strongest community candidate, with 82,698 views and 2,279 likes. Its preview is a compact green particle sphere on a dark surface, which matches field intelligence and monitoring without pretending to depict agriculture. Two lower-reach copies show that the community supports remixing, but the original public element will be inspected before adoption.

The original Reactive Orb is licensed under CC0 1.0 and offers a Remix action. Its stated design is a sphere of smaller spheres that react to hover with size and color changes. It will be used as the single interactive landing hero object, recolored to AgriGuard’s field green and water blue direction, lazy-loaded, and limited to one page. The exact Remix project URL and embed code remain to be captured.

The Remix action was used in the connected workspace. The community page confirmed the action by increasing the Remix count from 15,798 to 15,799. The public original is not a copyable code snippet; Spline requires the remixed project to be opened, then exported as a Viewer or Code scene. The next step is to locate the copied project in My Files, capture its public scene URL, and set the Viewer export controls for a quiet, single-object hero.

The remixed project now exists in the connected workspace as `Reactive Orb`, last edited moments after the Remix action. Its private editor URL is `https://app.spline.design/file/b0fb6cf1-8827-4e2c-b7e3-8b65704faa14`. This private URL will not be placed in the web project. A public Viewer export URL is required before implementation.

The remixed scene has Viewer, Code, self-hosted, image, video, and 3D-format export choices. Viewer is the approved option because it supports a lightweight native web component with lazy loading. Before copying the embed code, the Renderer must be changed from `WebGPU Only` to a broader-compatibility setting if available, the Spline logo must be turned off, Loading Preview must stay enabled, and the performance test must be reviewed.

## Pexels video search

The connected browser is already signed in to Pexels. The approved source is the Pexels video library, and the first search is for a restrained aerial wheat-field clip. The video will be a secondary, silent visual on the landing page, not a competing hero. It will be deferred offscreen and will not autoplay for reduced-motion users.

The Pexels search for `wheat field aerial` returned a large public selection with horizontal and 4K filter options. The visible first row includes a wheat closeup, a green field aerial, and a second aerial field shot. The asset selection will prefer a horizontal, short, 1080p source that can be visibly credited in the project’s asset register.

The first selected candidate is a Pexels video by David Pickup, titled `A Tree in a Field with a Field in the Background`, at https://www.pexels.com/video/a-tree-in-a-field-with-a-field-in-the-background-27856878/. Pexels presents it as free to use with a free-download control. Its actual framing, duration, resolution choices, and rendered preview must be checked before download.

The David Pickup candidate is portrait, so it is rejected for the wide landing visual. The refreshed result grid shows a second candidate: a horizontal aerial view of patterned cropland. It will be checked next because its wide framing can support a full-bleed secondary section without a destructive crop.

The Pexels grid’s dynamic card identifiers reused the first video target when the horizontal thumbnail was selected. That repeated selection is rejected. The next selection method will use the page HTML to identify a unique direct video URL for a confirmed horizontal card, rather than relying on the dynamic grid element index.

The selected horizontal candidate is `Aerial View of Vibrant Green and Brown Fields` by Nikola Tomašić: https://www.pexels.com/video/aerial-view-of-vibrant-green-and-brown-fields-32648687/. Its page identifies it as free to use and describes green and brown fields divided by a path. The title, horizontal preview frame, agricultural tags, and creator attribution make it the approved secondary landing-page asset. The Pexels player did not render in the browser after two checks, but the page metadata and preview container confirm a video source. A 1080p or equivalent web-appropriate format will be downloaded instead of 4K to protect load performance.

The Pexels player then rendered as a wide aerial composition with green growing rows beside a brown harvested field. The 1280×720 HD option was selected. This format is the right balance for a deferred decorative landing section; it avoids the cost of 4K while preserving enough detail for desktop displays.

The approved Pexels clip was downloaded and re-encoded without audio to a 1280-pixel web version. Its managed web-storage path is `/manus-storage/agriguard-aerial-fields-1280_d9fa472b.mp4`. The landing page will use this exact path with a poster-style fallback, `playsInline`, `muted`, `loop`, and lazy activation when its section enters the viewport. Reduced-motion users will receive the static fallback only.

## Approved Spline Code scene

The approved hero scene is `https://prod.spline.design/uVqm7hH8m0iJQ5iX/scene.splinecode`. It is publicly reachable, returns JSON successfully, and has a compact 83,188-byte scene definition. The provided Next.js import must be adapted for this Vite React project: use `@splinetool/react-spline`, not `@splinetool/react-spline/next`.

The scene will be imported dynamically only after the landing hero is in or near the viewport. It will not be included in the operational dashboard. A CSS static hero state will render before the runtime scene loads, on reduced-motion devices, and on incompatible devices.

## 21st.dev observation

The public component catalog contains relevant dashboard, map, AI chat, input, loader, badge, and theme-control categories. The current account display shows a limit of two free copies per day. We will inspect only components with a direct use case and adapt them to the AgriGuard design system. We will not copy a component until its license, dependencies, and accessibility behavior are visible.

## SmoothUI verification

The supplied AI references match current SmoothUI components. SmoothUI provides an MIT-licensed React, Tailwind, and Motion component library with a CLI that can add `ai-orb-face`, `ai-prompt-input`, and `ai-loader` with dependencies. [3]

The approved adoption set is the AI Orb Face for an optional evidence-assistant state and the grid AI Loader for evaluation waits. The prompt input remains conditional. It will be added only after the product includes a real conversation feature.

The project already includes `framer-motion`, `lucide-react`, `clsx`, and `tailwind-merge`. A future SmoothUI installation must target the existing client alias layout and must be reviewed before it modifies source files.

## References

[1]: https://docs.spline.design/exporting-your-scene/web/exporting-as-spline-viewer "Spline Viewer Export"

[2]: https://docs.spline.design/exporting-your-scene/how-to-optimize-your-scene "Spline Scene Optimization"

[3]: https://smoothui.dev/docs/components/ai-orb-face "SmoothUI AI Orb Face"
