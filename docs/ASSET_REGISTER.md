# AgriGuard Asset Register

| Asset | Purpose | Approved source | Deployment asset | Notes |
|---|---|---|---|---|
| Reactive Spline scene | Interactive landing hero | `https://prod.spline.design/uVqm7hH8m0iJQ5iX/scene.splinecode` | External public Code scene | 83 KB scene definition. Use with `@splinetool/react-spline` in Vite React. Lazy-load only. |
| Aerial crop-field video | Secondary landing visual | User-supplied `13920447_1280_720_30fps.mp4` | `/manus-storage/agriguard-aerial-fields-final-web_95a93812.mp4` | 25-second 1280×720 H.264 source. Re-encoded without audio for web use. |
| Video poster | Static video and reduced-motion fallback | Derived from the user-supplied final video | `/manus-storage/agriguard-aerial-fields-final-poster_7f9c2449.jpg` | Use as the video poster and for reduced-motion mode. |
| AI Orb Face | Agent state component reference | [SmoothUI AI Orb Face](https://smoothui.dev/docs/components/ai-orb-face) | Local adapted component planned | Add only in monitoring and evidence-generation states. |
| AI Loader grid | Processing component reference | [SmoothUI AI Loader](https://smoothui.dev/docs/components/ai-loader) | Local adapted component planned | Use a real waiting state and optional elapsed time. |

The original 40 MB source remains outside the project directory and must not be deployed. The 14 MB web asset and its poster are the only approved video assets for the first release.
