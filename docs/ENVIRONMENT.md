# Environment Requirements

AgriGuard will require the following configuration when external integrations are enabled. Values must be stored in the deployment platform's secret manager. Do not commit a local environment file.

| Variable | Runtime location | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Client | Identifies the AgriGuard Supabase project. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Client | Allows browser access under Supabase row-level security rules. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Allows trusted server work that is not exposed to the browser. |
| `FORTYGUARD_API_KEY` | Server only | Authenticates approved requests for field temperature observations. |
| `FORTYGUARD_API_BASE_URL` | Server only | Sets the official FortyGuard API base URL. |
| `GROQ_API_KEY` | Server only | Authenticates Groq monitoring-agent requests. |
| `GROQ_MODEL` | Server only | Selects the approved Groq model, initially `openai/gpt-oss-20b`. |

The client must never receive server-only keys. The application must keep the template-report fallback enabled when Groq is unavailable.
