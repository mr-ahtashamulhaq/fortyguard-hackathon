# AgriGuard Asset Register

| Asset | Purpose | Approved source | Deployment asset | Notes |
|---|---|---|---|---|
| Reactive Spline scene | Interactive landing hero | `https://prod.spline.design/uVqm7hH8m0iJQ5iX/scene.splinecode` | External public Code scene | 83 KB scene definition. Use with `@splinetool/react-spline` in Vite React. Lazy-load only. |
| Aerial crop-field video | Secondary landing visual | [Pexels video by Nikola Tomašić](https://www.pexels.com/video/aerial-view-of-vibrant-green-and-brown-fields-32648687/) | `/manus-storage/agriguard-aerial-fields-1280_d9fa472b.mp4` | Free-to-use Pexels source. Re-encoded without audio at 1280 px wide. |
| Video poster | Static video and reduced-motion fallback | Derived from the approved Pexels video | `/manus-storage/agriguard-aerial-fields-poster_b8a8831a.jpg` | Use as the video poster and for reduced-motion mode. |
| AI Orb Face | Agent state component reference | [SmoothUI AI Orb Face](https://smoothui.dev/docs/components/ai-orb-face) | Local adapted component planned | Add only in monitoring and evidence-generation states. |
| AI Loader grid | Processing component reference | [SmoothUI AI Loader](https://smoothui.dev/docs/components/ai-loader) | Local adapted component planned | Use a real waiting state and optional elapsed time. |

The original 162 MB video source remains outside the project directory and must not be deployed. The 13 MB web asset and its 369 KB poster are the only approved video assets for the first release.
