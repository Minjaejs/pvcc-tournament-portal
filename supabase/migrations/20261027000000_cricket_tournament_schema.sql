-- ==============================================================================
-- PVCC CRICKET TOURNAMENT REGISTRATION SYSTEM - DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- 1. Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 2. ENUMS & DOMAINS
do $$ begin
  create type team_status as enum ('DRAFT', 'PENDING', 'ENROLLED', 'REJECTED');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type player_role as enum ('batsman', 'bowler', 'all_rounder', 'wicket_keeper');
exception
  when duplicate_object then null;
end $$;

-- ==============================================================================
-- 3. TABLES DEFINITION
-- ==============================================================================

-- Admin Profiles: Identifies users with administrative privileges
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null default 'admin' check (role in ('admin', 'superadmin')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- Tournaments Table
create table if not exists public.tournaments (
  id text primary key,
  name text not null,
  season text not null,
  organizer text not null,
  fee_amount numeric(10, 2) not null default 10000.00,
  min_players integer not null default 11,
  max_players integer not null default 15,
  registration_deadline timestamptz,
  is_registration_open boolean not null default true,
  payment_instructions jsonb not null default '[]'::jsonb,
  rules jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Teams Table
create table if not exists public.teams (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  registration_code text not null unique,
  team_name text not null,
  city text not null,
  captain_name text not null,
  captain_phone text not null,
  captain_email text,
  status team_status not null default 'DRAFT',
  rejection_reason text,
  payment_method text,
  transaction_id text,
  payment_slip_url text,
  payment_submitted_at timestamptz,
  verified_at timestamptz,
  verified_by uuid references public.admin_profiles(id),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Players Table (Multi-player entries belonging to a team)
create table if not exists public.players (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  player_name text not null,
  father_name text not null,
  cnic text not null,
  dob date not null,
  address text not null,
  role player_role not null default 'all_rounder',
  seasons_played text[] not null default '{}',
  achievements_note text,
  is_captain boolean not null default false,
  photo_url text,
  cnic_front_url text,
  cnic_back_url text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Registration Audit Events (Tracks approval/rejection timeline)
create table if not exists public.registration_events (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  actor_id uuid references auth.users(id),
  action text not null, -- 'SUBMITTED', 'APPROVED', 'REJECTED', 'UPDATED'
  notes text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- Indexes for performance
create index if not exists idx_teams_user_id on public.teams(user_id);
create index if not exists idx_teams_status on public.teams(status);
create index if not exists idx_players_team_id on public.players(team_id);
create index if not exists idx_admin_profiles_id on public.admin_profiles(id);
create unique index if not exists idx_players_cnic on public.players(cnic);
create unique index if not exists idx_players_unique_captain_per_team on public.players(team_id) where (is_captain = true);

-- ==============================================================================
-- 4. HELPER FUNCTIONS
-- ==============================================================================

-- Check if current authenticated user is an authorized admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 
    from public.admin_profiles 
    where id = auth.uid()
  );
$$;

-- Sequence for team registration codes
create sequence if not exists public.team_registration_code_seq;

-- Auto-generate readable registration code (e.g. PVCC-2026-0001)
create or replace function public.generate_registration_code()
returns trigger
language plpgsql
security definer -- Critical: bypasses RLS so the trigger can check all existing codes
set search_path = public
as $$
declare
  candidate_code text;
  next_num integer;
begin
  if new.registration_code is null or new.registration_code = '' then
    loop
      next_num := nextval('public.team_registration_code_seq');
      candidate_code := 'PVCC-2026-' || lpad(next_num::text, 4, '0');
      
      -- Ensure candidate code does not collide with existing teams
      exit when not exists (
        select 1 from public.teams where registration_code = candidate_code
      );
    end loop;
    new.registration_code := candidate_code;
  end if;
  return new;
end;
$$;

drop trigger if exists trigger_assign_registration_code on public.teams;
create trigger trigger_assign_registration_code
  before insert on public.teams
  for each row
  execute function public.generate_registration_code();

-- Auto update timestamp trigger
create or replace function public.update_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists trigger_teams_timestamp on public.teams;
create trigger trigger_teams_timestamp
  before update on public.teams
  for each row
  execute function public.update_timestamp();

drop trigger if exists trigger_players_timestamp on public.players;
create trigger trigger_players_timestamp
  before update on public.players
  for each row
  execute function public.update_timestamp();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.admin_profiles enable row level security;
alter table public.tournaments enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.registration_events enable row level security;

-- 5.1 Admin Profiles Policies
create policy "Admins can view admin profiles"
  on public.admin_profiles for select
  using (auth.uid() = id or public.is_admin());

-- 5.2 Tournaments Policies
create policy "Public can read tournament settings"
  on public.tournaments for select
  using (true);

create policy "Only Admins can modify tournaments"
  on public.tournaments for all
  using (public.is_admin());

-- 5.3 Teams Policies
-- Public can view ONLY enrolled/approved teams (for public roster list)
create policy "Public can view enrolled teams"
  on public.teams for select
  using (status = 'ENROLLED');

-- Captains can view their own team
create policy "Captains can view their own team"
  on public.teams for select
  using (auth.uid() = user_id or public.is_admin());

-- Captains can insert their own team
create policy "Captains can create their own team"
  on public.teams for insert
  with check (auth.uid() = user_id);

-- Captains can update their own team only when status is DRAFT or REJECTED
create policy "Captains can edit draft or rejected team"
  on public.teams for update
  using (
    (auth.uid() = user_id and status in ('DRAFT', 'REJECTED'))
    or public.is_admin()
  );

-- Admins have full access to teams
create policy "Admins have full access to teams"
  on public.teams for all
  using (public.is_admin());

-- 5.4 Players Policies
-- Public can view players of officially ENROLLED teams (sensitive CNIC is hidden via view/app logic)
create policy "Public can view enrolled players"
  on public.players for select
  using (
    exists (
      select 1 from public.teams 
      where teams.id = players.team_id and teams.status = 'ENROLLED'
    )
  );

-- Captain can view their own team's players
create policy "Captains can view their own players"
  on public.players for select
  using (
    exists (
      select 1 from public.teams 
      where teams.id = players.team_id and teams.user_id = auth.uid()
    )
    or public.is_admin()
  );

-- Captain can insert players if team is DRAFT or REJECTED
create policy "Captains can add players to draft team"
  on public.players for insert
  with check (
    exists (
      select 1 from public.teams 
      where teams.id = players.team_id 
        and teams.user_id = auth.uid() 
        and teams.status in ('DRAFT', 'REJECTED')
    )
    or public.is_admin()
  );

-- Captain can update players in draft team
create policy "Captains can update players in draft team"
  on public.players for update
  using (
    exists (
      select 1 from public.teams 
      where teams.id = players.team_id 
        and teams.user_id = auth.uid() 
        and teams.status in ('DRAFT', 'REJECTED')
    )
    or public.is_admin()
  );

-- Captain can delete players from draft team
create policy "Captains can delete players from draft team"
  on public.players for delete
  using (
    exists (
      select 1 from public.teams 
      where teams.id = players.team_id 
        and teams.user_id = auth.uid() 
        and teams.status in ('DRAFT', 'REJECTED')
    )
    or public.is_admin()
  );

-- Admins have full access to players
create policy "Admins have full access to players"
  on public.players for all
  using (public.is_admin());

-- 5.5 Registration Events (Audit log)
create policy "Captains can view their team audit events"
  on public.registration_events for select
  using (
    exists (
      select 1 from public.teams 
      where teams.id = registration_events.team_id and teams.user_id = auth.uid()
    )
    or public.is_admin()
  );

create policy "Admins can insert audit events"
  on public.registration_events for insert
  with check (public.is_admin() or auth.uid() is not null);

-- ==============================================================================
-- 6. ATOMIC BUSINESS LOGIC (STORED PROCEDURES / RPC)
-- ==============================================================================

-- 6.1 Submit Team for Verification (Called by Captain)
create or replace function public.submit_team_registration(
  p_team_id uuid,
  p_payment_method text,
  p_transaction_id text,
  p_payment_slip_url text
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_user_id uuid := auth.uid();
  v_team record;
  v_player_count integer;
  v_captain_count integer;
begin
  -- Validate authentication
  if v_user_id is null then
    raise exception 'Unauthorized: Please log in to submit your team.';
  end if;

  -- Validate team ownership
  select * into v_team from public.teams where id = p_team_id;
  if not found then
    raise exception 'Team not found.';
  end if;

  if v_team.user_id <> v_user_id and not public.is_admin() then
    raise exception 'Permission denied: You can only submit your own team.';
  end if;

  -- Validate status
  if v_team.status not in ('DRAFT', 'REJECTED') then
    raise exception 'Team has already been submitted (Current status: %)', v_team.status;
  end if;

  -- Validate player counts (min 11, max 15)
  select count(*) into v_player_count from public.players where team_id = p_team_id;
  if v_player_count < 11 then
    raise exception 'Cannot submit: Team has only % players. Minimum required is 11.', v_player_count;
  end if;

  if v_player_count > 15 then
    raise exception 'Cannot submit: Team has % players. Maximum allowed is 15.', v_player_count;
  end if;

  -- Validate exactly 1 captain is designated
  select count(*) into v_captain_count from public.players where team_id = p_team_id and is_captain = true;
  if v_captain_count <> 1 then
    raise exception 'Cannot submit: Exactly 1 designated Team Captain is required (Found: %).', v_captain_count;
  end if;

  -- Validate payment slip and transaction ID
  if p_transaction_id is null or trim(p_transaction_id) = '' then
    raise exception 'Transaction ID / Reference Number is required.';
  end if;

  if p_payment_slip_url is null or trim(p_payment_slip_url) = '' then
    raise exception 'Payment slip upload is required.';
  end if;

  -- Update team status to PENDING
  update public.teams
  set
    status = 'PENDING',
    payment_method = p_payment_method,
    transaction_id = p_transaction_id,
    payment_slip_url = p_payment_slip_url,
    payment_submitted_at = timezone('utc'::text, now()),
    rejection_reason = null
  where id = p_team_id;

  -- Log audit event
  insert into public.registration_events (team_id, actor_id, action, notes)
  values (p_team_id, v_user_id, 'SUBMITTED', 'Team submitted with ' || v_player_count || ' players and payment slip.');

  return jsonb_build_object(
    'success', true,
    'status', 'PENDING',
    'message', 'Registration submitted successfully. Awaiting management verification.'
  );
end;
$$;

-- 6.2 Approve Team (Called by Admin)
create or replace function public.approve_team(
  p_team_id uuid,
  p_admin_notes text default null
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_admin_id uuid := auth.uid();
  v_team record;
begin
  -- Check admin authorization
  if not public.is_admin() then
    raise exception 'Unauthorized: Only tournament administrators can approve teams.';
  end if;

  select * into v_team from public.teams where id = p_team_id;
  if not found then
    raise exception 'Team not found.';
  end if;

  if v_team.status = 'ENROLLED' then
    raise exception 'Team is already officially ENROLLED.';
  end if;

  -- Update to ENROLLED
  update public.teams
  set
    status = 'ENROLLED',
    verified_at = timezone('utc'::text, now()),
    verified_by = v_admin_id,
    rejection_reason = null
  where id = p_team_id;

  -- Log audit event
  insert into public.registration_events (team_id, actor_id, action, notes)
  values (p_team_id, v_admin_id, 'APPROVED', coalesce(p_admin_notes, 'Payment and player documents verified.'));

  return jsonb_build_object(
    'success', true,
    'status', 'ENROLLED',
    'message', 'Team has been officially approved and enrolled!'
  );
end;
$$;

-- 6.3 Reject Team (Called by Admin)
create or replace function public.reject_team(
  p_team_id uuid,
  p_rejection_reason text
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_admin_id uuid := auth.uid();
  v_team record;
begin
  -- Check admin authorization
  if not public.is_admin() then
    raise exception 'Unauthorized: Only tournament administrators can reject teams.';
  end if;

  if p_rejection_reason is null or trim(p_rejection_reason) = '' then
    raise exception 'A rejection reason is required (e.g. invalid receipt, blurry CNIC).';
  end if;

  select * into v_team from public.teams where id = p_team_id;
  if not found then
    raise exception 'Team not found.';
  end if;

  -- Update to REJECTED (allows captain to update their submission)
  update public.teams
  set
    status = 'REJECTED',
    rejection_reason = p_rejection_reason,
    verified_at = timezone('utc'::text, now()),
    verified_by = v_admin_id
  where id = p_team_id;

  -- Log audit event
  insert into public.registration_events (team_id, actor_id, action, notes)
  values (p_team_id, v_admin_id, 'REJECTED', 'Rejected with reason: ' || p_rejection_reason);

  return jsonb_build_object(
    'success', true,
    'status', 'REJECTED',
    'message', 'Team submission marked as rejected.'
  );
end;
$$;

-- ==============================================================================
-- 7. STORAGE BUCKETS & ACCESS POLICIES
-- ==============================================================================

-- Create private buckets for payment receipts and sensitive player CNIC documents
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('player-documents', 'player-documents', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('payment-slips', 'payment-slips', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760;

-- Storage RLS: Player Documents
create policy "Authenticated users can upload player documents"
  on storage.objects for insert
  with check (
    bucket_id = 'player-documents'
    and auth.role() = 'authenticated'
  );

create policy "Captains can view their own documents or Admins can view all"
  on storage.objects for select
  using (
    bucket_id = 'player-documents'
    and (
      auth.uid() = owner
      or public.is_admin()
    )
  );

-- Storage RLS: Payment Slips
create policy "Authenticated users can upload payment slips"
  on storage.objects for insert
  with check (
    bucket_id = 'payment-slips'
    and auth.role() = 'authenticated'
  );

create policy "Captains can view own payment slip or Admins can view all"
  on storage.objects for select
  using (
    bucket_id = 'payment-slips'
    and (
      auth.uid() = owner
      or public.is_admin()
    )
  );

-- ==============================================================================
-- 8. DEFAULT SEED DATA (Tournament Settings)
-- ==============================================================================
insert into public.tournaments (
  id, name, season, organizer, fee_amount, min_players, max_players, 
  registration_deadline, is_registration_open, payment_instructions, rules
)
values (
  'pvcc-season-4',
  'Punjab Village Cricket Council (PVCC)',
  'Season 4 Championship 2026',
  'Punjab Village Cricket Council Management Committee',
  10000.00,
  11,
  15,
  timezone('utc'::text, now() + interval '30 days'),
  true,
  '[
    {
      "id": "ep-1",
      "method": "easypaisa",
      "provider": "EasyPaisa",
      "accountTitle": "Ali Nawaz (PVCC Treasurer)",
      "accountNumber": "03001234567",
      "note": "Please write team name in transfer remarks."
    },
    {
      "id": "jc-1",
      "method": "jazzcash",
      "provider": "JazzCash",
      "accountTitle": "Ali Nawaz",
      "accountNumber": "03007654321",
      "note": "Save screenshot of the transfer receipt."
    },
    {
      "id": "bank-1",
      "method": "bank",
      "provider": "Meezan Bank Ltd.",
      "accountTitle": "Punjab Village Cricket Council",
      "accountNumber": "01020304050607",
      "iban": "PK12MEZN0001020304050607",
      "note": "IBAN transfer supported from all Pakistani banking apps."
    }
  ]'::jsonb,
  '[
    "Minimum 11 and maximum 15 registered players per squad.",
    "Clear CNIC Front & Back and passport-style photo required for every player.",
    "Only 1 designated Captain per squad.",
    "Registration fee must be transferred via EasyPaisa, JazzCash, or Bank.",
    "Official enrollment is granted only after management verifies the payment receipt.",
    "No player can be enrolled in multiple teams during the same tournament."
  ]'::jsonb
)
on conflict (id) do nothing;
