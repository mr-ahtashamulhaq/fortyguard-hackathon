create extension if not exists pgcrypto;

create table public.fields (
  id text primary key,
  name text not null,
  region text not null,
  latitude double precision not null,
  longitude double precision not null,
  hectares numeric(10, 2) not null check (hectares > 0),
  crop text not null default 'wheat',
  crop_stage text not null,
  source_status text not null default 'synthetic_demo' check (source_status in ('synthetic_demo', 'fortyguard', 'stale', 'unavailable')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.policies (
  id uuid primary key default gen_random_uuid(),
  field_id text not null references public.fields(id) on delete restrict,
  version text not null,
  threshold_c numeric(5, 2) not null check (threshold_c > 0),
  minimum_continuous_hours numeric(5, 2) not null check (minimum_continuous_hours > 0),
  eligible_stages jsonb not null default '[]'::jsonb,
  payout_currency text not null default 'INR',
  maximum_simulated_amount numeric(12, 2) not null check (maximum_simulated_amount >= 0),
  effective_from timestamptz not null,
  effective_to timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (effective_to > effective_from),
  unique (field_id, version)
);

create table public.temperature_observations (
  id uuid primary key default gen_random_uuid(),
  field_id text not null references public.fields(id) on delete cascade,
  source text not null check (source in ('synthetic_demo', 'fortyguard')),
  observed_at timestamptz not null,
  temperature_c numeric(5, 2) not null check (temperature_c > -80 and temperature_c < 80),
  quality text not null default 'verified' check (quality in ('verified', 'estimated', 'stale')),
  source_metadata jsonb not null default '{}'::jsonb,
  ingested_at timestamptz not null default now(),
  unique (field_id, source, observed_at)
);

create table public.heat_evaluations (
  id uuid primary key default gen_random_uuid(),
  run_key text not null unique,
  field_id text not null references public.fields(id) on delete restrict,
  policy_id uuid not null references public.policies(id) on delete restrict,
  source text not null check (source in ('synthetic_demo', 'fortyguard')),
  status text not null check (status in ('safe', 'watch', 'triggered', 'data_unavailable')),
  qualifying_observation_count integer not null default 0 check (qualifying_observation_count >= 0),
  continuous_exposure_hours numeric(7, 2) not null default 0 check (continuous_exposure_hours >= 0),
  heat_score numeric(8, 2) not null default 0 check (heat_score >= 0),
  payout_band text not null check (payout_band in ('none', '25_percent', '50_percent', '100_percent')),
  simulated_amount numeric(12, 2) not null default 0 check (simulated_amount >= 0),
  policy_snapshot jsonb not null,
  evaluated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.evidence_records (
  id uuid primary key default gen_random_uuid(),
  record_code text not null unique,
  evaluation_id uuid not null unique references public.heat_evaluations(id) on delete restrict,
  field_id text not null references public.fields(id) on delete restrict,
  report jsonb not null,
  agent_explanation text not null,
  agent_mode text not null check (agent_mode in ('groq_tool_call', 'template_fallback')),
  created_at timestamptz not null default now()
);

create table public.payout_events (
  id uuid primary key default gen_random_uuid(),
  payout_key text not null unique,
  evaluation_id uuid not null unique references public.heat_evaluations(id) on delete restrict,
  field_id text not null references public.fields(id) on delete restrict,
  policy_id uuid not null references public.policies(id) on delete restrict,
  payout_band text not null check (payout_band in ('25_percent', '50_percent', '100_percent')),
  simulated_amount numeric(12, 2) not null check (simulated_amount > 0),
  currency text not null default 'INR',
  status text not null default 'ready_for_review' check (status in ('ready_for_review', 'reviewed', 'recorded', 'voided')),
  is_simulated boolean not null default true check (is_simulated),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table public.audit_entries (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('field', 'policy', 'evaluation', 'evidence_record', 'payout_event')),
  entity_id text not null,
  action text not null,
  actor text not null default 'agri_guard_monitoring_agent',
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index temperature_observations_field_observed_at_idx on public.temperature_observations (field_id, observed_at desc);
create index heat_evaluations_field_evaluated_at_idx on public.heat_evaluations (field_id, evaluated_at desc);
create index audit_entries_entity_created_at_idx on public.audit_entries (entity_type, entity_id, created_at desc);

alter table public.fields enable row level security;
alter table public.policies enable row level security;
alter table public.temperature_observations enable row level security;
alter table public.heat_evaluations enable row level security;
alter table public.evidence_records enable row level security;
alter table public.payout_events enable row level security;
alter table public.audit_entries enable row level security;
