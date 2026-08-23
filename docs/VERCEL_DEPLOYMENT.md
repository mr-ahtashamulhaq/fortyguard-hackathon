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

### Asset Ownership

The temporary `files.manuscdn.com` URLs used during the first Vercel deployment are Manus-managed upload URLs. Vercel reads the MP4 and poster directly from that CDN when the landing page loads. The files are not copied into the Vercel deployment or the GitHub repository.

These URLs remain available while the related Manus-managed storage remains available. They are not the correct permanent home for a project that the repository owner must control. Do not use them as the long-term landing-media URLs.

### Free User-Owned Media Path

Use a **public Vercel Blob store** in the same Vercel account that owns the AgriGuard deployment. This keeps the landing media, deployment, environment variables, and access control in one user-owned Vercel account.

1. Open **AgriGuard → Storage** in Vercel.
2. Select **Create Database**, then select **Blob**.
3. Set the store access to **Public** and create the store.
4. Upload the approved MP4 and JPEG poster from your computer.
5. Copy the two generated URLs. Public Blob URLs use the `public.blob.vercel-storage.com` domain.[3]
6. Replace the two landing-media variables in the AgriGuard Vercel project with these user-owned URLs.
7. Redeploy the project.

Vercel Blob is free within the Vercel Hobby plan limits. If the account reaches a limit, Vercel disables Blob access until the rolling 30-day limit expires; it does not charge extra usage on Hobby.[4]

The project source remains in GitHub, the deployed application and public media remain in Vercel, and operational data remains in Supabase. Keep API keys only in Vercel environment variables.

### Media Fallback Behavior

The public Blob media incident was **not** caused by an absent URL, an incorrect MIME type, or a server runtime error. The MP4 and poster returned public HTTP 200 responses, the client bundle contained both configured URLs, and the browser could load the MP4 metadata. The original client implementation immediately replaced the video with the poster after its first browser `error` event. That made a transient client-side media error look like a permanent broken video.

AgriGuard now retains the poster during loading and retries the public MP4 once with a cache-busting URL before using the image-only fallback. The image fallback is therefore reserved for a second failed media attempt or a missing public video URL. This keeps the page readable while preserving the video path when the source is reachable.

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

[3] [Vercel Blob public storage](https://vercel.com/docs/vercel-blob/public-storage)

[4] [Vercel Blob pricing and Hobby limits](https://vercel.com/docs/vercel-blob/usage-and-pricing)
