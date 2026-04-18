import React from "react";
import { Navigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { getNextOnboardingPage } from "@/services/profile";

export default function RequireAuth({ children, requiredRole, allowIncompleteOnboarding = false }) {
  const { user, profile, loading, profileLoading } = useAuth();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center px-4">
        <div className="text-sm text-slate-500">Loading…</div>
      </div>
    );
  }

  if (!user) {
    const to = requiredRole ? `${createPageUrl("Login")}?role=${requiredRole}` : createPageUrl("Login");
    return <Navigate to={to} replace />;
  }

  if (profile?.__error) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          <h1 className="text-base font-bold text-slate-900 mb-2">Account setup incomplete</h1>
          <p className="text-sm text-slate-600">
            You are signed in, but your profile could not be loaded. Finish Supabase database setup (tables + RLS policies),
            then refresh.
          </p>
        </div>
      </div>
    );
  }

  if (!profile || !profile.role) {
    return <Navigate to={createPageUrl("AuthCallback")} replace />;
  }

  if (requiredRole && profile?.role && profile.role !== requiredRole) {
    return <Navigate to={createPageUrl("AuthCallback")} replace />;
  }

  if (!allowIncompleteOnboarding && profile?.role && !profile.onboarding_completed_at) {
    return (
      <Navigate
        to={createPageUrl(getNextOnboardingPage({ role: profile.role, onboardingStep: profile.onboarding_step ?? 0 }))}
        replace
      />
    );
  }

  return <>{children}</>;
}
