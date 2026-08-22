# Vercel Deployment

## Deployment Shape

AgriGuard uses a Vite React client and an Express tRPC API. The Vercel setup builds the client to `dist/public` and maps `/api/*` requests to one Node.js serverless function.

The project remains public and does not require Manus sign-in for the judge flow. Manus OAuth routes remain available but are not required for the portfolio, field, evidence, or ledger screens.

## Required Vercel Variables

Add these variables in **Project Settings → Environment Variables**. Add them to Production, Preview, and Development.

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL for the operational data layer. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Browser-safe Supabase publishable key used by the client. |
| `SUPABASE_SECRET_KEY` | Yes | Server-only Supabase key for stored observations, evidence, and simulated ledger entries. |
| `FORTYGUARD_API_KEY` | Yes | Server-only key for the live Fresno temperature requests. |
| `GROQ_API_KEY` | Yes | Server-only key for the controlled evidence explanation agent. |
| `JWT_SECRET` | Yes | Cookie-signing secret for the existing server infrastructure. Use a new long random value. |
| `VITE_APP_TITLE` | Recommended | Browser title. Set `AgriGuard — FortyGuard Hackathon`. |
| `VITE_DEPLOYMENT_TARGET` | Yes | Set `vercel`. This prevents the Vercel build from referencing Manus-only landing media paths. |
| `VITE_LANDING_VIDEO_URL` | Recommended | Public HTTPS URL for the approved aerial-field MP4. |
| `VITE_LANDING_POSTER_URL` | Recommended | Public HTTPS URL for the matching JPEG poster. |

Do not add `SUPABASE_SECRET_KEY`, `FORTYGUARD_API_KEY`, `GROQ_API_KEY`, or `JWT_SECRET` to the client code or a Git commit.

## Optional Manus Compatibility Variables

The public judge flow does not require Manus OAuth or Manus storage. Leave the following variables unset unless you deliberately keep those Manus-specific paths active on Vercel: `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`, and `VITE_FRONTEND_FORGE_API_KEY`.

If you add them, use values that are valid for the deployed Vercel URL. Do not copy Manus preview credentials into the Vercel project.

## Landing Media

The Manus preview serves the landing video from Manus storage. Vercel cannot use that relative storage path. When `VITE_DEPLOYMENT_TARGET=vercel`, AgriGuard shows a branded field-signal fallback unless public media URLs are provided.

Upload the approved MP4 and poster to a public asset host, such as Vercel Blob, then set `VITE_LANDING_VIDEO_URL` and `VITE_LANDING_POSTER_URL`. The product flow remains functional without these two optional visual URLs.

## Deploy From GitHub

1. Open [Vercel](https://vercel.com/new).
2. Select the GitHub repository `mr-ahtashamulhaq/fortyguard-hackathon`.
3. Keep the root directory as `./`.
4. Let Vercel use the repository `vercel.json` file.
5. Add the required variables above. Keep server-only variables unexposed to the browser.
6. Click **Deploy**.
7. Open the deployment URL. Visit `/app/portfolio` and confirm the source label says `Verified FortyGuard data`.
8. Open `/app/evidence/LIVE-FRESNO-2024071514` and confirm the 25% result still says `simulated`.

## Post-Deployment Check

The live monitoring action makes three sequential FortyGuard heatmap requests. The Vercel function allows 60 seconds. If the provider takes longer, the stored verified evidence route and synthetic fallback remain available for the judge demo.

## References

[1] [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json)

[2] [Vercel function duration](https://vercel.com/docs/functions/configuring-functions/duration)
