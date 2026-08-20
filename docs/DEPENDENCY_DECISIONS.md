# AgriGuard Dependency Decisions

| Dependency | Current version checked | Planned use | Scope rule |
|---|---:|---|---|
| `lenis` | 1.3.26 | Landing-page smooth scroll | Do not initialize in the application workspace. |
| `gsap` | 3.15.0 | Landing-page scroll sequence | Register ScrollTrigger once. Do not use a separate listener per section. |
| `@splinetool/react-spline` | 4.1.0 | Approved Spline Code hero scene | Use the base React package. Do not use the provided `/next` import in this Vite project. |
| `framer-motion` | Already in project | Small UI transitions, adapted AI states, theme-symbol motion | Do not add a second UI-motion library for the same job. |
| `@supabase/supabase-js` | Already added to foundation | Public client and server connection | Do not create the application schema until it is approved. |
| `leaflet` and `react-leaflet` | Already added to foundation | Portfolio map | Render only in the portfolio route. |
| `recharts` | Already in project | Temperature and heat-score charts | Render only in field-detail views. |

The implementation phase will install only `lenis`, `gsap`, and `@splinetool/react-spline` after the user authorizes product code. Existing `framer-motion` will be reused for adapted SmoothUI reference components, avoiding an additional `motion` package.
