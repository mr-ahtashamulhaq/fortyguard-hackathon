# AgriGuard Architecture Boundaries

## System boundary

AgriGuard is a single web application with a React client and an Express plus tRPC server. The server is the trusted boundary. It stores business data in Supabase, reads temperature observations from FortyGuard, applies the policy engine, and calls Groq only to generate a controlled explanation.

```text
React client
    ↓ tRPC
AgriGuard server
    ├── FortyGuard Temperature API
    ├── deterministic heat policy engine
    ├── Groq explanation agent
    └── Supabase Postgres
```

## Decision boundary

The policy engine owns all insurance-like decisions. It calculates qualifying exposure, heat score, payout band, and the simulated payout amount. Groq receives structured results and may call only allow-listed server tools. It cannot set a threshold, bypass the crop-stage rule, or create a duplicate payout.

## Data boundary

The Supabase project is the source of truth for AgriGuard business records. The project will add tables for fields, policies, observations, evaluations, evidence records, payout events, and audit entries after the schema review. No AgriGuard schema has been applied yet.

## Safety boundary

The client never receives the Supabase service-role key, FortyGuard API key, or Groq API key. The client receives a structured explanation record whether the source is Groq or the fallback template. This gives the evidence view one stable response shape.

## Demo boundary

The synthetic heat-wave scenario is a separate, clearly labeled data mode. The application must carry the **Synthetic demo data** label into the dashboard, field view, evidence view, and ledger rows that use the scenario.
