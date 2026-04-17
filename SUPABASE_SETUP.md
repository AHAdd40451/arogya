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
- Open **SQL Editor**
- Run: `supabase/migrations/20260417_0001_auth_onboarding.sql`

This creates:
- `public.profiles` (1:1 with `auth.users`)
- `public.patients` (patient onboarding data)
- `public.providers` (provider onboarding data)
- RLS policies so users can only access their own rows
- A trigger that auto-creates `profiles` row on signup/OAuth

## 5) App routes
Auth pages:
- `/Login`
- `/Signup`
- `/ForgotPassword`
- `/ResetPassword`
- `/AuthCallback`
- `/ChooseRole`

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

