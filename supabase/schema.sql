-- Vibha Art Supabase setup.
-- Safe to re-run: it only creates missing tables/indexes and refreshes policies.

create extension if not exists pgcrypto;

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  mobile text not null,
  message text not null,
  source text default 'website-contact-form',
  created_at timestamptz not null default now()
);

create table if not exists public.brochure_download_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  company text,
  brochure_name text not null default 'Vibha_Printing Media',
  source text default 'hero-brochure-modal',
  created_at timestamptz not null default now()
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  socket_id text unique,
  session_id text unique,
  user_name text,
  user_email text,
  user_phone text,
  messages jsonb not null default '[]'::jsonb,
  payload jsonb,
  last_activity timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_pipeline (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null,
  lead_type text not null check (lead_type in ('contact', 'brochure')),
  status text not null default 'new',
  assigned_to text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_activity (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null,
  lead_type text not null check (lead_type in ('contact', 'brochure')),
  event text not null,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null,
  lead_type text not null check (lead_type in ('contact', 'brochure')),
  requirements text not null,
  estimated_budget numeric,
  status text not null default 'new',
  quote_draft text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null,
  lead_type text not null check (lead_type in ('contact', 'brochure')),
  calendar_provider text,
  booking_link text,
  time_slot timestamptz,
  reminder_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_reply_drafts (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null,
  lead_type text not null check (lead_type in ('contact', 'brochure')),
  to_email text not null,
  subject text not null,
  body text not null,
  status text not null default 'draft',
  meta jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_leads_created_at_idx
  on public.contact_leads (created_at desc);

create index if not exists brochure_download_leads_created_at_idx
  on public.brochure_download_leads (created_at desc);

create index if not exists chat_sessions_socket_id_idx
  on public.chat_sessions (socket_id);

create index if not exists chat_sessions_session_id_idx
  on public.chat_sessions (session_id);

create index if not exists lead_pipeline_lead_idx
  on public.lead_pipeline (lead_id, lead_type);

create index if not exists lead_activity_lead_idx
  on public.lead_activity (lead_id, lead_type, created_at desc);

create index if not exists email_reply_drafts_lead_idx
  on public.email_reply_drafts (lead_id, lead_type, created_at desc);

create unique index if not exists lead_activity_message_idempotency_idx
  on public.lead_activity (lead_id, lead_type, event, (meta->>'message_id'))
  where meta ? 'message_id';

alter table public.contact_leads enable row level security;
alter table public.brochure_download_leads enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.lead_pipeline enable row level security;
alter table public.lead_activity enable row level security;
alter table public.quote_requests enable row level security;
alter table public.appointments enable row level security;
alter table public.email_reply_drafts enable row level security;

drop policy if exists "Allow anonymous insert contact_leads" on public.contact_leads;
create policy "Allow anonymous insert contact_leads"
  on public.contact_leads
  for insert
  to anon
  with check (true);

drop policy if exists "Allow anonymous insert brochure_download_leads" on public.brochure_download_leads;
create policy "Allow anonymous insert brochure_download_leads"
  on public.brochure_download_leads
  for insert
  to anon
  with check (true);
