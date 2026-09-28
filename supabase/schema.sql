-- Run this once in the Supabase SQL editor for the goldman-automation project.
-- Service-role key bypasses RLS; no policies are added because nothing but
-- the server routes (using the secret key) should ever read or write here.

create extension if not exists pgcrypto;

create table if not exists site_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('form', 'chat')),
  name text,
  email text,
  phone text,
  business_type text,
  business_name text,
  main_problem text,
  best_times text,
  language text not null default 'en' check (language in ('en', 'pl')),
  notes text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'audit_done', 'won', 'lost', 'unsubscribed')),
  contacted_at timestamptz,
  followup_sent_at timestamptz,
  chat_conversation_id uuid
);

create table if not exists chat_conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  page_url text,
  transcript jsonb not null default '[]'::jsonb,
  lead_id uuid references site_leads(id) on delete set null,
  ip_hash text
);

alter table site_leads
  add constraint site_leads_chat_conversation_id_fkey
  foreign key (chat_conversation_id) references chat_conversations(id) on delete set null;

create index if not exists site_leads_followup_idx
  on site_leads (status, created_at)
  where followup_sent_at is null;

alter table site_leads enable row level security;
alter table chat_conversations enable row level security;
