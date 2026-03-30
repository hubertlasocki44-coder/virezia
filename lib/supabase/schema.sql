-- =============================================================================
-- VIREZIA -- Complete Supabase Database Schema
-- =============================================================================
-- Run this file against a fresh Supabase project.
-- Requires: pgcrypto extension (enabled by default on Supabase).
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";


-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

-- 1.1 profiles (extends auth.users) ----------------------------------------
create table public.profiles (
  id              uuid        primary key references auth.users(id) on delete cascade,
  email           text        not null,
  full_name       text,
  phone           text,
  avatar_url      text,
  company_name    text,
  role            text        not null default 'buyer'
                              check (role in (
                                'super_admin','employee','buyer','developer',
                                'agent','broker','asset_owner','service_partner'
                              )),
  partner_type    text        check (partner_type in (
                                'relocation','concierge','beach_club','legal','other'
                              )),
  status          text        not null default 'pending_verification'
                              check (status in (
                                'active','pending_verification','suspended','rejected'
                              )),
  verified_at     timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- 1.2 employee_permissions --------------------------------------------------
create table public.employee_permissions (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        references public.profiles(id) on delete cascade unique,
  modules         text[]      default '{}',
  created_at      timestamptz default now()
);

-- 1.3 applications ----------------------------------------------------------
create table public.applications (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        references public.profiles(id) on delete set null,
  type            text        not null,
  step_data       jsonb       default '{}',
  status          text        not null default 'pending'
                              check (status in (
                                'pending','screening','qualified','approved','rejected','archived'
                              )),
  assigned_to     uuid        references public.profiles(id),
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- 1.4 leads -----------------------------------------------------------------
create table public.leads (
  id                  uuid        primary key default gen_random_uuid(),
  client_id           uuid        references public.profiles(id) on delete cascade not null,
  status              text        not null default 'new'
                                  check (status in (
                                    'new','screening','qualified','matched',
                                    'in_progress','closed_won','closed_lost','archived'
                                  )),
  source              text        default 'apply'
                                  check (source in (
                                    'apply','manual','referral','circle','reach_signal'
                                  )),
  assigned_employee   uuid        references public.profiles(id),
  priority            text        default 'medium'
                                  check (priority in ('low','medium','high','urgent')),
  score               int         default 0
                                  check (score >= 0 and score <= 100),
  supply_side         boolean     default false,
  supply_archetype    text        check (supply_archetype in (
                                    'frustrated_visionary','stuck_developer',
                                    'volume_seeker','kit_pusher'
                                  )),
  supply_scorecard    jsonb,
  client_fit_scorecard jsonb,
  notes               text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- 1.5 lead_assignments ------------------------------------------------------
create table public.lead_assignments (
  id                uuid        primary key default gen_random_uuid(),
  lead_id           uuid        references public.leads(id) on delete cascade not null,
  partner_id        uuid        references public.profiles(id) on delete cascade not null,
  visibility_level  text        not null default 'limited'
                                check (visibility_level in ('full','limited')),
  status            text        not null default 'active'
                                check (status in ('active','completed','revoked')),
  notes             text,
  assigned_by       uuid        references public.profiles(id) not null,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- 1.6 buyer_profiles --------------------------------------------------------
create table public.buyer_profiles (
  id                    uuid        primary key default gen_random_uuid(),
  user_id               uuid        references public.profiles(id) on delete cascade unique not null,
  investment_type       text,
  buyer_type            text        default 'individual',
  budget_range          text,
  timeline              text,
  regions_interest      text[]      default '{}',
  property_type         text[]      default '{}',
  purpose               text,
  priorities            text,
  lifestyle_preferences text,
  archetype             text        check (archetype in (
                                      'architect_of_life','investor_strategist',
                                      'escapist_relocator','security_seeker','collector'
                                    )),
  archetype_history     jsonb       default '[]',
  readiness_score       int         default 0
                                    check (readiness_score >= 0 and readiness_score <= 100),
  priority_tier         text        generated always as (
                                      case
                                        when readiness_score >= 70 then 'p1'
                                        when readiness_score >= 40 then 'p2'
                                        else 'p3'
                                      end
                                    ) stored,
  notes                 text,
  status                text        default 'active',
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- 1.7 blog_posts ------------------------------------------------------------
create table public.blog_posts (
  id                uuid        primary key default gen_random_uuid(),
  title             text        not null,
  slug              text        unique not null,
  content           text        not null,
  excerpt           text,
  featured_image    text,
  author_id         uuid        references public.profiles(id),
  published         boolean     default false,
  published_at      timestamptz,
  seo_title         text,
  seo_description   text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- 1.8 interactions ----------------------------------------------------------
create table public.interactions (
  id                  uuid        primary key default gen_random_uuid(),
  lead_id             uuid        references public.leads(id) on delete cascade not null,
  type                text        not null
                                  check (type in (
                                    'note','email','call','meeting',
                                    'whatsapp','status_change','assignment'
                                  )),
  content             text        not null,
  metadata            jsonb,
  created_by          uuid        references public.profiles(id) not null,
  visible_to_partner  boolean     default false,
  created_at          timestamptz default now()
);

-- 1.9 circle_requests -------------------------------------------------------
create table public.circle_requests (
  id              uuid        primary key default gen_random_uuid(),
  email           text        not null,
  status          text        default 'pending'
                              check (status in ('pending','invited','rejected')),
  created_at      timestamptz default now()
);

-- 1.10 audit_requests -------------------------------------------------------
create table public.audit_requests (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        references public.profiles(id) on delete set null,
  tier              text        not null
                                check (tier in ('basic','premium','full_protection')),
  property_address  text        not null,
  property_type     text,
  contact_name      text        not null,
  contact_email     text        not null,
  contact_phone     text,
  status            text        default 'pending'
                                check (status in ('pending','in_progress','completed','cancelled')),
  assigned_to       uuid        references public.profiles(id),
  report_url        text,
  price_paid        decimal,
  notes             text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- 1.11 deal_briefs ----------------------------------------------------------
create table public.deal_briefs (
  id              uuid        primary key default gen_random_uuid(),
  template_type   text        not null
                              check (template_type in (
                                'asset_repositioned','buyer_protected',
                                'matched_fast','developer_unblocked'
                              )),
  content         text        not null,
  metrics         jsonb       default '{}',
  published       boolean     default false,
  created_at      timestamptz default now()
);


-- ---------------------------------------------------------------------------
-- 2. Indexes
-- ---------------------------------------------------------------------------
create index idx_leads_status            on public.leads (status);
create index idx_leads_client_id         on public.leads (client_id);
create index idx_lead_assignments_lead   on public.lead_assignments (lead_id);
create index idx_lead_assignments_partner on public.lead_assignments (partner_id);
create index idx_interactions_lead       on public.interactions (lead_id);
create index idx_blog_posts_slug         on public.blog_posts (slug);
create index idx_blog_posts_published    on public.blog_posts (published);
create index idx_applications_user_id    on public.applications (user_id);
create index idx_applications_status     on public.applications (status);


-- ---------------------------------------------------------------------------
-- 3. Triggers -- updated_at auto-touch
-- ---------------------------------------------------------------------------

-- Generic function: sets updated_at = now() on every UPDATE.
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply to every table that carries an updated_at column.
create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.applications
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.leads
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.lead_assignments
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.buyer_profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.blog_posts
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.audit_requests
  for each row execute function public.handle_updated_at();


-- ---------------------------------------------------------------------------
-- 4. Trigger -- auto-create profile on auth.users insert
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    'buyer',
    'pending_verification'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ---------------------------------------------------------------------------
-- 5. Helper functions used inside RLS policies
-- ---------------------------------------------------------------------------

-- Returns the role of the currently authenticated user.
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Returns true when the current user is a super_admin.
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$;

-- Returns true when the current user is an employee (or super_admin).
create or replace function public.is_employee()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('employee', 'super_admin')
  );
$$;

-- Returns true when the current employee has a specific module permission.
create or replace function public.employee_has_module(required_module text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.employee_permissions ep
    inner join public.profiles p on p.id = ep.user_id
    where ep.user_id = auth.uid()
      and p.role in ('employee', 'super_admin')
      and required_module = any(ep.modules)
  )
  or public.is_super_admin();
$$;


-- ---------------------------------------------------------------------------
-- 6. Row Level Security -- enable on ALL tables
-- ---------------------------------------------------------------------------
alter table public.profiles           enable row level security;
alter table public.employee_permissions enable row level security;
alter table public.applications       enable row level security;
alter table public.leads              enable row level security;
alter table public.lead_assignments   enable row level security;
alter table public.buyer_profiles     enable row level security;
alter table public.blog_posts         enable row level security;
alter table public.interactions       enable row level security;
alter table public.circle_requests    enable row level security;
alter table public.audit_requests     enable row level security;
alter table public.deal_briefs        enable row level security;


-- ---------------------------------------------------------------------------
-- 6.1 profiles
-- ---------------------------------------------------------------------------

-- Users can read their own profile.
create policy "profiles: users read own"
  on public.profiles for select
  using (auth.uid() = id);

-- Employees with leads module can read all profiles.
create policy "profiles: employees with leads read all"
  on public.profiles for select
  using (public.employee_has_module('leads'));

-- Super admins have full CRUD on profiles.
create policy "profiles: super_admin insert"
  on public.profiles for insert
  with check (public.is_super_admin());

create policy "profiles: super_admin update"
  on public.profiles for update
  using (public.is_super_admin());

create policy "profiles: super_admin delete"
  on public.profiles for delete
  using (public.is_super_admin());

-- Allow users to update their own profile (safe fields only).
create policy "profiles: users update own safe fields"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
    and status = (select status from public.profiles where id = auth.uid())
  );

-- The service_role key (used by the trigger) bypasses RLS, so the
-- handle_new_user trigger will still insert. However, if you want the
-- auth trigger to work with anon/user tokens too, add:
create policy "profiles: allow insert from auth trigger"
  on public.profiles for insert
  with check (auth.uid() = id);


-- ---------------------------------------------------------------------------
-- 6.2 employee_permissions -- super_admin only
-- ---------------------------------------------------------------------------

create policy "employee_permissions: super_admin select"
  on public.employee_permissions for select
  using (public.is_super_admin());

create policy "employee_permissions: super_admin insert"
  on public.employee_permissions for insert
  with check (public.is_super_admin());

create policy "employee_permissions: super_admin update"
  on public.employee_permissions for update
  using (public.is_super_admin());

create policy "employee_permissions: super_admin delete"
  on public.employee_permissions for delete
  using (public.is_super_admin());

-- Allow employees to read their own permissions (needed by helper functions
-- when running under the user's JWT rather than service_role).
create policy "employee_permissions: employees read own"
  on public.employee_permissions for select
  using (auth.uid() = user_id);


-- ---------------------------------------------------------------------------
-- 6.3 applications
-- ---------------------------------------------------------------------------

-- Users can read their own applications.
create policy "applications: users read own"
  on public.applications for select
  using (auth.uid() = user_id);

-- Users can insert their own applications.
create policy "applications: users insert own"
  on public.applications for insert
  with check (auth.uid() = user_id);

-- Employees with applications module: full CRUD.
create policy "applications: employees select"
  on public.applications for select
  using (public.employee_has_module('applications'));

create policy "applications: employees insert"
  on public.applications for insert
  with check (public.employee_has_module('applications'));

create policy "applications: employees update"
  on public.applications for update
  using (public.employee_has_module('applications'));

create policy "applications: employees delete"
  on public.applications for delete
  using (public.employee_has_module('applications'));


-- ---------------------------------------------------------------------------
-- 6.4 leads
-- ---------------------------------------------------------------------------

-- Employees with leads module: full CRUD.
create policy "leads: employees select"
  on public.leads for select
  using (public.employee_has_module('leads'));

create policy "leads: employees insert"
  on public.leads for insert
  with check (public.employee_has_module('leads'));

create policy "leads: employees update"
  on public.leads for update
  using (public.employee_has_module('leads'));

create policy "leads: employees delete"
  on public.leads for delete
  using (public.employee_has_module('leads'));

-- Super admin full access (already covered by employee_has_module fallback,
-- but explicit for clarity).
create policy "leads: super_admin all"
  on public.leads for all
  using (public.is_super_admin())
  with check (public.is_super_admin());


-- ---------------------------------------------------------------------------
-- 6.5 lead_assignments
-- ---------------------------------------------------------------------------

-- Partners can read their own assignments.
create policy "lead_assignments: partners read own"
  on public.lead_assignments for select
  using (auth.uid() = partner_id);

-- Employees with leads module: full CRUD.
create policy "lead_assignments: employees select"
  on public.lead_assignments for select
  using (public.employee_has_module('leads'));

create policy "lead_assignments: employees insert"
  on public.lead_assignments for insert
  with check (public.employee_has_module('leads'));

create policy "lead_assignments: employees update"
  on public.lead_assignments for update
  using (public.employee_has_module('leads'));

create policy "lead_assignments: employees delete"
  on public.lead_assignments for delete
  using (public.employee_has_module('leads'));


-- ---------------------------------------------------------------------------
-- 6.6 buyer_profiles
-- ---------------------------------------------------------------------------

-- Buyer reads their own profile.
create policy "buyer_profiles: buyer reads own"
  on public.buyer_profiles for select
  using (auth.uid() = user_id);

-- Buyer can update their own profile.
create policy "buyer_profiles: buyer updates own"
  on public.buyer_profiles for update
  using (auth.uid() = user_id);

-- Buyer can insert their own profile.
create policy "buyer_profiles: buyer inserts own"
  on public.buyer_profiles for insert
  with check (auth.uid() = user_id);

-- Partners can read buyer profiles when they have an active lead_assignment
-- for a lead belonging to that buyer.
create policy "buyer_profiles: partners read via assignment"
  on public.buyer_profiles for select
  using (
    exists (
      select 1
      from public.lead_assignments la
      inner join public.leads l on l.id = la.lead_id
      where la.partner_id = auth.uid()
        and la.status = 'active'
        and l.client_id = buyer_profiles.user_id
    )
  );

-- Employees: full CRUD.
create policy "buyer_profiles: employees select"
  on public.buyer_profiles for select
  using (public.is_employee());

create policy "buyer_profiles: employees insert"
  on public.buyer_profiles for insert
  with check (public.is_employee());

create policy "buyer_profiles: employees update"
  on public.buyer_profiles for update
  using (public.is_employee());

create policy "buyer_profiles: employees delete"
  on public.buyer_profiles for delete
  using (public.is_employee());


-- ---------------------------------------------------------------------------
-- 6.7 blog_posts
-- ---------------------------------------------------------------------------

-- Anyone can read published posts.
create policy "blog_posts: public reads published"
  on public.blog_posts for select
  using (published = true);

-- Employees with blog module: full CRUD.
create policy "blog_posts: employees select"
  on public.blog_posts for select
  using (public.employee_has_module('blog'));

create policy "blog_posts: employees insert"
  on public.blog_posts for insert
  with check (public.employee_has_module('blog'));

create policy "blog_posts: employees update"
  on public.blog_posts for update
  using (public.employee_has_module('blog'));

create policy "blog_posts: employees delete"
  on public.blog_posts for delete
  using (public.employee_has_module('blog'));


-- ---------------------------------------------------------------------------
-- 6.8 interactions
-- ---------------------------------------------------------------------------

-- Employees with leads module: full CRUD.
create policy "interactions: employees select"
  on public.interactions for select
  using (public.employee_has_module('leads'));

create policy "interactions: employees insert"
  on public.interactions for insert
  with check (public.employee_has_module('leads'));

create policy "interactions: employees update"
  on public.interactions for update
  using (public.employee_has_module('leads'));

create policy "interactions: employees delete"
  on public.interactions for delete
  using (public.employee_has_module('leads'));

-- Partners can read interactions marked visible_to_partner on leads they
-- are assigned to.
create policy "interactions: partners read visible on assigned leads"
  on public.interactions for select
  using (
    visible_to_partner = true
    and exists (
      select 1
      from public.lead_assignments la
      where la.lead_id = interactions.lead_id
        and la.partner_id = auth.uid()
        and la.status = 'active'
    )
  );


-- ---------------------------------------------------------------------------
-- 6.9 circle_requests
-- ---------------------------------------------------------------------------

-- Anyone can insert a circle request (public landing page).
create policy "circle_requests: anyone inserts"
  on public.circle_requests for insert
  with check (true);

-- Employees can read all circle requests.
create policy "circle_requests: employees read"
  on public.circle_requests for select
  using (public.is_employee());


-- ---------------------------------------------------------------------------
-- 6.10 audit_requests
-- ---------------------------------------------------------------------------

-- Users can read their own audit requests.
create policy "audit_requests: users read own"
  on public.audit_requests for select
  using (auth.uid() = user_id);

-- Users can insert their own audit requests.
create policy "audit_requests: users insert own"
  on public.audit_requests for insert
  with check (auth.uid() = user_id);

-- Employees: full CRUD.
create policy "audit_requests: employees select"
  on public.audit_requests for select
  using (public.is_employee());

create policy "audit_requests: employees insert"
  on public.audit_requests for insert
  with check (public.is_employee());

create policy "audit_requests: employees update"
  on public.audit_requests for update
  using (public.is_employee());

create policy "audit_requests: employees delete"
  on public.audit_requests for delete
  using (public.is_employee());

-- Super admin full access (explicit).
create policy "audit_requests: super_admin all"
  on public.audit_requests for all
  using (public.is_super_admin())
  with check (public.is_super_admin());


-- ---------------------------------------------------------------------------
-- 6.11 deal_briefs
-- ---------------------------------------------------------------------------

-- Anyone can read published deal briefs.
create policy "deal_briefs: public reads published"
  on public.deal_briefs for select
  using (published = true);

-- Employees with briefs module: full CRUD.
create policy "deal_briefs: employees select"
  on public.deal_briefs for select
  using (public.employee_has_module('briefs'));

create policy "deal_briefs: employees insert"
  on public.deal_briefs for insert
  with check (public.employee_has_module('briefs'));

create policy "deal_briefs: employees update"
  on public.deal_briefs for update
  using (public.employee_has_module('briefs'));

create policy "deal_briefs: employees delete"
  on public.deal_briefs for delete
  using (public.employee_has_module('briefs'));


-- ===========================================================================
-- END OF SCHEMA
-- ===========================================================================
