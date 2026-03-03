-- Run this in Supabase SQL Editor

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

alter table public.contact_leads enable row level security;
alter table public.brochure_download_leads enable row level security;

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

