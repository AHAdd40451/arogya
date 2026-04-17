-- Arogya: Auth + Onboarding schema (Supabase)
-- Apply in Supabase SQL Editor, or via Supabase CLI migrations.

-- Extensions (optional, useful for future tables)
create extension if not exists "pgcrypto";

-- Enums
do $$
begin
  create type public.user_role as enum ('patient', 'provider');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.provider_application_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

-- Helpers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role public.user_role,
  onboarding_step integer not null default 0,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_onboarding_step_nonneg check (onboarding_step >= 0)
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_onboarding_completed_idx on public.profiles(onboarding_completed_at);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Role is immutable once set (client role choice is NOT trusted for authorization)
create or replace function public.profiles_role_immutable()
returns trigger
language plpgsql
as $$
begin
  if old.role is not null and new.role is distinct from old.role then
    raise exception 'profiles.role is immutable once set';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_role_immutable on public.profiles;
create trigger profiles_role_immutable
before update of role on public.profiles
for each row execute function public.profiles_role_immutable();

-- Create profile row automatically on signup / OAuth sign-in
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Patient data (1:1 with profiles for patient role)
create table if not exists public.patients (
  user_id uuid primary key references public.profiles(user_id) on delete cascade,
  date_of_birth date,
  gender text,
  current_symptoms text,
  existing_conditions text,
  current_medications text,
  allergies text,
  primary_care_physician text,
  past_surgeries text,
  chronic_conditions text,
  family_history text,
  smoking_status text,
  alcohol_use text,
  consent_telehealth boolean,
  consent_emergency_ack boolean,
  consent_terms boolean,
  consented_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists patients_set_updated_at on public.patients;
create trigger patients_set_updated_at
before update on public.patients
for each row execute function public.set_updated_at();

-- Provider data (1:1 with profiles for provider role)
create table if not exists public.providers (
  user_id uuid primary key references public.profiles(user_id) on delete cascade,
  application_status public.provider_application_status not null default 'pending',
  np_license_number text,
  license_state text,
  years_experience integer,
  specialty text,
  malpractice_insurer text,
  malpractice_policy_number text,
  malpractice_expiration_date date,
  malpractice_confirmed boolean,
  work_history text,
  education text,
  background_check_consent boolean,
  availability_days text[],
  availability_start text,
  availability_end text,
  services_offered text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint providers_years_experience_nonneg check (years_experience is null or years_experience >= 0)
);

create index if not exists providers_status_idx on public.providers(application_status);

drop trigger if exists providers_set_updated_at on public.providers;
create trigger providers_set_updated_at
before update on public.providers
for each row execute function public.set_updated_at();

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.providers enable row level security;

-- Profiles: users can read/update their own row
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
using (auth.uid() = user_id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Patients: only the owning user, and only when role=patient
drop policy if exists patients_select_own on public.patients;
create policy patients_select_own
on public.patients
for select
using (auth.uid() = user_id);

drop policy if exists patients_insert_own on public.patients;
create policy patients_insert_own
on public.patients
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'patient'
  )
);

drop policy if exists patients_update_own on public.patients;
create policy patients_update_own
on public.patients
for update
using (
  auth.uid() = user_id
  and exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'patient'
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'patient'
  )
);

-- Providers: only the owning user, and only when role=provider
drop policy if exists providers_select_own on public.providers;
create policy providers_select_own
on public.providers
for select
using (auth.uid() = user_id);

drop policy if exists providers_insert_own on public.providers;
create policy providers_insert_own
on public.providers
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'provider'
  )
);

drop policy if exists providers_update_own on public.providers;
create policy providers_update_own
on public.providers
for update
using (
  auth.uid() = user_id
  and exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'provider'
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'provider'
  )
);

