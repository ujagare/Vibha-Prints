-- Full email automation support:
-- AI reply drafts, lead pipeline indexes, and quote/follow-up tracking.

create extension if not exists pgcrypto;

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

create index if not exists email_reply_drafts_lead_idx
  on public.email_reply_drafts (lead_id, lead_type, created_at desc);

create index if not exists lead_pipeline_status_idx
  on public.lead_pipeline (status, updated_at desc);

create index if not exists lead_activity_event_idx
  on public.lead_activity (event, created_at desc);

create unique index if not exists lead_activity_message_idempotency_idx
  on public.lead_activity (lead_id, lead_type, event, (meta->>'message_id'))
  where meta ? 'message_id';

alter table public.email_reply_drafts enable row level security;
