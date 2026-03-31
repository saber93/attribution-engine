begin;

-- ============================================================================
-- Phase 1 core schema for campaign analytics + CRM
-- ============================================================================

create type public.ad_platform as enum (
  'google',
  'meta',
  'tiktok',
  'linkedin',
  'snapchat',
  'other'
);

create type public.campaign_status as enum (
  'draft',
  'active',
  'paused',
  'completed',
  'archived'
);

create type public.lead_status as enum (
  'new',
  'contacted',
  'qualified',
  'unqualified',
  'converted',
  'lost'
);

create type public.contact_lifecycle_stage as enum (
  'lead',
  'marketing_qualified',
  'sales_qualified',
  'opportunity',
  'customer',
  'inactive'
);

create type public.deal_stage as enum (
  'new',
  'contacted',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost'
);

create type public.task_status as enum (
  'pending',
  'in_progress',
  'completed',
  'canceled'
);

create type public.task_priority as enum (
  'low',
  'medium',
  'high',
  'urgent'
);

create type public.task_type as enum (
  'call',
  'follow_up',
  'meeting',
  'email',
  'whatsapp',
  'review',
  'other'
);

create type public.activity_type as enum (
  'call',
  'email',
  'whatsapp',
  'meeting',
  'note',
  'system'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  platform public.ad_platform not null,
  status public.campaign_status not null default 'draft',
  objective text,
  external_campaign_id text,
  owner_user_id uuid references auth.users (id) on delete set null,
  currency text not null default 'USD',
  metadata jsonb not null default '{}'::jsonb,
  daily_budget numeric(14, 2),
  total_budget numeric(14, 2),
  spend_amount numeric(14, 2) not null default 0,
  impressions bigint not null default 0,
  clicks bigint not null default 0,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaigns_date_range_chk check (
    start_date is null
    or end_date is null
    or end_date >= start_date
  ),
  constraint campaigns_daily_budget_chk check (daily_budget is null or daily_budget >= 0),
  constraint campaigns_total_budget_chk check (total_budget is null or total_budget >= 0),
  constraint campaigns_spend_amount_chk check (spend_amount >= 0),
  constraint campaigns_impressions_chk check (impressions >= 0),
  constraint campaigns_clicks_chk check (clicks >= 0)
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  website_url text,
  industry text,
  size_band text,
  owner_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies (id) on delete set null,
  owner_user_id uuid references auth.users (id) on delete set null,
  converted_contact_id uuid,
  full_name text not null,
  email text,
  phone text,
  status public.lead_status not null default 'new',
  score integer,
  platform public.ad_platform,
  source text not null default 'unknown',
  campaign_id uuid references public.campaigns (id) on delete set null,
  ad_group_id text,
  ad_id text,
  landing_page_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  gclid text,
  fbclid text,
  external_click_id text,
  other_click_ids jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  qualified_at timestamptz,
  converted_at timestamptz,
  disqualified_at timestamptz,
  disqualification_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_email_or_phone_chk check (email is not null or phone is not null),
  constraint leads_score_chk check (score is null or score between 0 and 100)
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies (id) on delete set null,
  source_lead_id uuid references public.leads (id) on delete set null,
  owner_user_id uuid references auth.users (id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  job_title text,
  lifecycle_stage public.contact_lifecycle_stage not null default 'lead',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contacts_email_or_phone_chk check (email is not null or phone is not null)
);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete restrict,
  primary_contact_id uuid references public.contacts (id) on delete set null,
  source_lead_id uuid references public.leads (id) on delete set null,
  owner_user_id uuid references auth.users (id) on delete set null,
  title text not null,
  amount numeric(14, 2) not null default 0,
  currency text not null default 'USD',
  stage public.deal_stage not null default 'new',
  stage_changed_at timestamptz not null default now(),
  probability integer,
  expected_close_date date,
  closed_at timestamptz,
  won_at timestamptz,
  lost_at timestamptz,
  lost_reason text,
  platform public.ad_platform,
  source text,
  campaign_id uuid references public.campaigns (id) on delete set null,
  ad_group_id text,
  ad_id text,
  landing_page_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  gclid text,
  fbclid text,
  external_click_id text,
  other_click_ids jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deals_amount_chk check (amount >= 0),
  constraint deals_probability_chk check (probability is null or probability between 0 and 100)
);

alter table public.leads
  add constraint leads_converted_contact_id_fkey
  foreign key (converted_contact_id)
  references public.contacts (id)
  on delete set null;

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  assigned_user_id uuid references auth.users (id) on delete set null,
  created_by_user_id uuid references auth.users (id) on delete set null,
  title text not null,
  description text,
  type public.task_type not null default 'follow_up',
  priority public.task_priority not null default 'medium',
  status public.task_status not null default 'pending',
  due_at timestamptz,
  completed_at timestamptz,
  campaign_id uuid references public.campaigns (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete cascade,
  company_id uuid references public.companies (id) on delete cascade,
  deal_id uuid references public.deals (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_single_parent_chk check (
    num_nonnulls(campaign_id, lead_id, contact_id, company_id, deal_id) = 1
  )
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users (id) on delete set null,
  type public.activity_type not null,
  title text not null,
  description text,
  occurred_at timestamptz not null default now(),
  duration_minutes integer,
  campaign_id uuid references public.campaigns (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete cascade,
  company_id uuid references public.companies (id) on delete cascade,
  deal_id uuid references public.deals (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activities_duration_minutes_chk check (
    duration_minutes is null or duration_minutes >= 0
  ),
  constraint activities_single_parent_chk check (
    num_nonnulls(campaign_id, lead_id, contact_id, company_id, deal_id) = 1
  )
);

-- One lead can be the canonical source for at most one converted contact.
create unique index contacts_source_lead_id_unique
  on public.contacts (source_lead_id)
  where source_lead_id is not null;

-- Campaign indexes
create unique index campaigns_platform_external_campaign_id_unique
  on public.campaigns (platform, external_campaign_id)
  where external_campaign_id is not null;

create index campaigns_owner_status_idx
  on public.campaigns (owner_user_id, status);

create index campaigns_platform_status_idx
  on public.campaigns (platform, status);

create index campaigns_name_lookup_idx
  on public.campaigns (lower(name));

-- Company indexes
create unique index companies_domain_unique
  on public.companies (lower(domain))
  where domain is not null;

create index companies_owner_idx
  on public.companies (owner_user_id);

create index companies_name_lookup_idx
  on public.companies (lower(name));

-- Lead indexes
create index leads_company_idx
  on public.leads (company_id);

create index leads_owner_status_idx
  on public.leads (owner_user_id, status);

create index leads_campaign_idx
  on public.leads (campaign_id);

create index leads_status_created_at_idx
  on public.leads (status, created_at desc);

create index leads_platform_created_at_idx
  on public.leads (platform, created_at desc);

create index leads_email_lookup_idx
  on public.leads (lower(email))
  where email is not null;

create index leads_gclid_idx
  on public.leads (gclid)
  where gclid is not null;

create index leads_fbclid_idx
  on public.leads (fbclid)
  where fbclid is not null;

create index leads_external_click_id_idx
  on public.leads (external_click_id)
  where external_click_id is not null;

create index leads_converted_contact_idx
  on public.leads (converted_contact_id)
  where converted_contact_id is not null;

-- Contact indexes
create index contacts_company_idx
  on public.contacts (company_id);

create index contacts_owner_stage_idx
  on public.contacts (owner_user_id, lifecycle_stage);

create index contacts_email_lookup_idx
  on public.contacts (lower(email))
  where email is not null;

create index contacts_created_at_idx
  on public.contacts (created_at desc);

-- Deal indexes
create index deals_company_idx
  on public.deals (company_id);

create index deals_primary_contact_idx
  on public.deals (primary_contact_id);

create index deals_source_lead_idx
  on public.deals (source_lead_id);

create index deals_owner_stage_idx
  on public.deals (owner_user_id, stage);

create index deals_stage_expected_close_idx
  on public.deals (stage, expected_close_date);

create index deals_campaign_idx
  on public.deals (campaign_id);

create index deals_created_at_idx
  on public.deals (created_at desc);

create index deals_open_owner_expected_close_idx
  on public.deals (owner_user_id, expected_close_date)
  where stage not in ('won', 'lost');

-- Task indexes
create index tasks_assigned_status_due_idx
  on public.tasks (assigned_user_id, status, due_at);

create index tasks_created_by_idx
  on public.tasks (created_by_user_id);

create index tasks_campaign_idx
  on public.tasks (campaign_id)
  where campaign_id is not null;

create index tasks_lead_idx
  on public.tasks (lead_id)
  where lead_id is not null;

create index tasks_contact_idx
  on public.tasks (contact_id)
  where contact_id is not null;

create index tasks_company_idx
  on public.tasks (company_id)
  where company_id is not null;

create index tasks_deal_idx
  on public.tasks (deal_id)
  where deal_id is not null;

-- Activity indexes
create index activities_actor_occurred_at_idx
  on public.activities (actor_user_id, occurred_at desc);

create index activities_campaign_occurred_at_idx
  on public.activities (campaign_id, occurred_at desc)
  where campaign_id is not null;

create index activities_lead_occurred_at_idx
  on public.activities (lead_id, occurred_at desc)
  where lead_id is not null;

create index activities_contact_occurred_at_idx
  on public.activities (contact_id, occurred_at desc)
  where contact_id is not null;

create index activities_company_occurred_at_idx
  on public.activities (company_id, occurred_at desc)
  where company_id is not null;

create index activities_deal_occurred_at_idx
  on public.activities (deal_id, occurred_at desc)
  where deal_id is not null;

create trigger set_campaigns_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

create trigger set_companies_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

create trigger set_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

create trigger set_contacts_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

create trigger set_deals_updated_at
before update on public.deals
for each row execute function public.set_updated_at();

create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

create trigger set_activities_updated_at
before update on public.activities
for each row execute function public.set_updated_at();

commit;
