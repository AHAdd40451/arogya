# Supabase Setup (Auth + Onboarding)

## 1) Create Supabase project
- Create a new Supabase project.
- In **Project Settings → API**, copy:
  - Project URL
  - `anon` public key

## 2) Configure environment variables
- Copy `.env.example` to `.env`
- Set:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_PUBLIC_SITE_URL` (use your deployed URL in production)

## 3) Configure Supabase Auth
In **Authentication → URL Configuration**:
- Add your Site URL(s), e.g.:
  - `http://localhost:5173`
- Add redirect URLs:
  - `http://localhost:5173/AuthCallback`
  - `http://localhost:5173/ResetPassword`

In **Authentication → Providers**:
- Enable **Email** (email confirmations recommended for production)
- Enable **Google** and add OAuth client credentials
  - Ensure Google OAuth redirect URI matches Supabase’s required callback (shown in Supabase UI)

## 4) Apply database schema + RLS

Run the migrations **in order** in the Supabase SQL Editor:

### Migration 1 — Auth + Onboarding
- Run: `supabase/migrations/20260417_0001_auth_onboarding.sql`

Creates:
- `public.profiles` (1:1 with `auth.users`)
- `public.patients` (patient onboarding data)
- `public.providers` (provider onboarding data)
- RLS policies so users can only access their own rows
- A trigger that auto-creates `profiles` row on signup/OAuth

### Migration 2 — Chat
- Run: `supabase/migrations/20260427_0002_chat.sql`
- Then: `supabase/migrations/20260427_0003_chat_rls_fix.sql`

Creates real-time provider↔patient messaging tables.

### Migration 3 — Booking *(apply after migration 1)*
- Run: `supabase/migrations/20260508_0004_booking.sql`

Creates:
- `btree_gist` extension (needed for provider double-booking exclusion constraint)
- `public.appointment_status` enum (`scheduled | in_progress | completed | canceled`)
- New columns on `public.providers`: `is_online`, `time_zone`, `slot_duration_minutes`
- `public.appointments` table with:
  - Provider/patient UUIDs, start/end timestamps, status, concern, mode
  - Snapshot fields (`provider_name`, `patient_name`, etc.) so dashboard queries don't need cross-user profile reads
  - EXCLUDE constraint preventing provider double-booking
  - Indexes for dashboard queries
  - RLS: participants read/update their own rows; only patients can insert; core fields are immutable after creation
- Three SECURITY DEFINER RPCs (callable only by `authenticated` role):
  - `list_bookable_providers(service, only_online)` — safe provider directory for patients
  - `list_provider_booked_times(provider_user_id, window_start, window_end)` — slot conflict data (no patient info)
  - `book_appointment(provider_user_id, starts_at, concern)` — atomic booking with snapshot capture

## 5) App routes
Auth pages:
- `/Login`
- `/Signup`
- `/ForgotPassword`
- `/ResetPassword`
- `/AuthCallback`

Onboarding pages (protected):
- Patient: `/PatientOnboarding1` → `/PatientOnboarding4`
- Provider: `/ProviderOnboarding1` → `/ProviderOnboarding5`

Dashboards (protected):
- `/PatientDashboard`
- `/ProviderDashboard`

## 6) Recommended production hardening
- Turn on **email confirmation**
- Add rate-limiting + bot protection (e.g., hCaptcha) for signup/login
- Use Supabase **Storage** buckets for provider documents (license, insurance, ID, resume)
- Create admin-only tables/policies for verification workflows (provider approval)
