-- Arogya: Booking schema (Supabase)
-- Apply after 20260417_0001_auth_onboarding.sql

-- Required for EXCLUDE with mixed types (uuid equality + tstzrange overlap)
create extension if not exists btree_gist;

-- Appointment status enum
do $$
begin
  create type public.appointment_status as enum ('scheduled', 'in_progress', 'completed', 'canceled');
exception
  when duplicate_object then null;
end $$;

-- ───────────────────────────────────────────
-- A. Extend public.providers
-- ───────────────────────────────────────────
alter table public.providers
  add column if not exists is_online boolean not null default false,
  add column if not exists time_zone text,
  add column if not exists slot_duration_minutes int not null default 15;

-- ───────────────────────────────────────────
-- B. Appointments table
-- ───────────────────────────────────────────
create table if not exists public.appointments (
  id                       uuid primary key default gen_random_uuid(),
  provider_user_id         uuid not null references public.profiles(user_id),
  patient_user_id          uuid not null references public.profiles(user_id),
  starts_at                timestamptz not null,
  ends_at                  timestamptz not null,
  status                   public.appointment_status not null default 'scheduled',
  concern                  text,
  mode                     text not null default 'video',
  -- Snapshot fields so dashboard queries don't need cross-user profile reads
  provider_name            text not null,
  patient_name             text not null,
  provider_specialty       text,
  provider_years_experience int,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),

  constraint appointments_ends_after_starts check (ends_at > starts_at),

  -- Prevent provider double-booking: active appointments may not overlap
  exclude using gist (
    provider_user_id with =,
    tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status = 'scheduled' or status = 'in_progress')
);

-- Indexes for dashboard queries
create index if not exists appointments_provider_starts_idx on public.appointments(provider_user_id, starts_at);
create index if not exists appointments_patient_starts_idx  on public.appointments(patient_user_id,  starts_at);
create index if not exists appointments_status_idx          on public.appointments(status);

drop trigger if exists appointments_set_updated_at on public.appointments;
create trigger appointments_set_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────
-- C. RLS policies for appointments
-- ───────────────────────────────────────────
alter table public.appointments enable row level security;

-- SELECT: either participant can read their own appointments
drop policy if exists appointments_select_participant on public.appointments;
create policy appointments_select_participant
on public.appointments
for select
using (auth.uid() = provider_user_id or auth.uid() = patient_user_id);

-- INSERT: only authenticated patients can create (role verified in DB)
drop policy if exists appointments_insert_patient on public.appointments;
create policy appointments_insert_patient
on public.appointments
for insert
with check (
  auth.uid() = patient_user_id
  and exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'patient'
  )
);

-- UPDATE: either participant can update (trigger enforces field immutability)
drop policy if exists appointments_update_participant on public.appointments;
create policy appointments_update_participant
on public.appointments
for update
using  (auth.uid() = provider_user_id or auth.uid() = patient_user_id)
with check (auth.uid() = provider_user_id or auth.uid() = patient_user_id);

-- DELETE: not allowed
drop policy if exists appointments_no_delete on public.appointments;
create policy appointments_no_delete
on public.appointments
for delete
using (false);

-- Trigger: make core booking fields immutable after insert
create or replace function public.appointments_immutable_fields()
returns trigger
language plpgsql
as $$
begin
  if new.provider_user_id is distinct from old.provider_user_id
    or new.patient_user_id  is distinct from old.patient_user_id
    or new.starts_at         is distinct from old.starts_at
    or new.ends_at           is distinct from old.ends_at
  then
    raise exception 'appointments: provider_user_id, patient_user_id, starts_at, ends_at are immutable after creation';
  end if;
  return new;
end;
$$;

drop trigger if exists appointments_immutable_fields on public.appointments;
create trigger appointments_immutable_fields
before update of provider_user_id, patient_user_id, starts_at, ends_at
on public.appointments
for each row execute function public.appointments_immutable_fields();

-- ───────────────────────────────────────────
-- D. RPC functions (SECURITY DEFINER so patients can safely read provider data
--    without direct access to public.providers)
-- ───────────────────────────────────────────

-- D1. Safe provider directory
create or replace function public.list_bookable_providers(
  p_service     text    default null,
  p_only_online boolean default false
)
returns table (
  provider_user_id      uuid,
  provider_name         text,
  specialty             text,
  years_experience      int,
  services_offered      text[],
  availability_days     text[],
  availability_start    text,
  availability_end      text,
  slot_duration_minutes int,
  time_zone             text,
  is_online             boolean
)
language sql
security definer
stable
set search_path = public
as $$
  select
    pr.user_id          as provider_user_id,
    p.full_name         as provider_name,
    pr.specialty,
    pr.years_experience,
    pr.services_offered,
    pr.availability_days,
    pr.availability_start,
    pr.availability_end,
    pr.slot_duration_minutes,
    pr.time_zone,
    pr.is_online
  from public.providers pr
  join public.profiles  p  on p.user_id = pr.user_id
  where
    p.onboarding_completed_at is not null
    and pr.application_status != 'rejected'
    and (p_service is null or pr.services_offered @> array[p_service]::text[])
    and (not p_only_online or pr.is_online = true)
  order by p.full_name;
$$;

revoke execute on function public.list_bookable_providers(text, boolean) from public, anon;
grant  execute on function public.list_bookable_providers(text, boolean) to   authenticated;

-- D2. Provider booked-times window (no patient identifiers)
create or replace function public.list_provider_booked_times(
  p_provider_user_id uuid,
  p_window_start     timestamptz,
  p_window_end       timestamptz
)
returns table (
  starts_at timestamptz,
  ends_at   timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select a.starts_at, a.ends_at
  from public.appointments a
  where
    a.provider_user_id = p_provider_user_id
    and (a.status = 'scheduled' or a.status = 'in_progress')
    and a.starts_at < p_window_end
    and a.ends_at   > p_window_start;
$$;

revoke execute on function public.list_provider_booked_times(uuid, timestamptz, timestamptz) from public, anon;
grant  execute on function public.list_provider_booked_times(uuid, timestamptz, timestamptz) to   authenticated;

-- D3. Book an appointment (handles snapshots + relies on EXCLUDE for conflict)
create or replace function public.book_appointment(
  p_provider_user_id uuid,
  p_starts_at        timestamptz,
  p_concern          text default null
)
returns public.appointments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_patient_user_id     uuid;
  v_patient_name        text;
  v_provider_name       text;
  v_provider_specialty  text;
  v_provider_years      int;
  v_slot_duration       int;
  v_ends_at             timestamptz;
  v_appointment         public.appointments;
begin
  v_patient_user_id := auth.uid();

  if v_patient_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Verify caller is a patient
  if not exists (
    select 1 from public.profiles
    where user_id = v_patient_user_id and role = 'patient'
  ) then
    raise exception 'Only patients can book appointments';
  end if;

  -- Fetch patient snapshot name
  select full_name into v_patient_name
  from public.profiles
  where user_id = v_patient_user_id;

  -- Fetch provider snapshot fields + slot duration
  select p.full_name, pr.specialty, pr.years_experience, pr.slot_duration_minutes
  into   v_provider_name, v_provider_specialty, v_provider_years, v_slot_duration
  from public.providers pr
  join public.profiles  p on p.user_id = pr.user_id
  where pr.user_id = p_provider_user_id;

  if v_provider_name is null then
    raise exception 'Provider not found';
  end if;

  v_slot_duration := coalesce(v_slot_duration, 15);
  v_ends_at       := p_starts_at + (v_slot_duration * interval '1 minute');

  insert into public.appointments (
    provider_user_id, patient_user_id,
    starts_at, ends_at, status,
    concern, mode,
    provider_name, patient_name,
    provider_specialty, provider_years_experience
  ) values (
    p_provider_user_id, v_patient_user_id,
    p_starts_at, v_ends_at, 'scheduled',
    p_concern, 'video',
    v_provider_name, v_patient_name,
    v_provider_specialty, v_provider_years
  )
  returning * into v_appointment;

  return v_appointment;
end;
$$;

revoke execute on function public.book_appointment(uuid, timestamptz, text) from public, anon;
grant  execute on function public.book_appointment(uuid, timestamptz, text) to   authenticated;
