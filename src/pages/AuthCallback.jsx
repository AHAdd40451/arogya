import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AuthLayout from "@/components/auth/AuthLayout";
import { exchangeCodeForSessionIfPresent } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";
import { getNextOnboardingPage, getRoleDashboardPage } from "@/services/profile";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, profile, loading, profileLoading, refreshProfile } = useAuth();
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    exchangeCodeForSessionIfPresent()
      .then(() => refreshProfile())
      .catch((e) => setError(e));
  }, [refreshProfile]);

  React.useEffect(() => {
    if (loading || profileLoading) return;
    if (!user) {
      navigate(createPageUrl("Login"), { replace: true });
      return;
    }

    if (profile?.__error) return;
    if (!profile) return;

    if (!profile.role) {
      navigate(createPageUrl("ChooseRole"), { replace: true });
      return;
    }

    if (!profile.onboarding_completed_at) {
      navigate(
        createPageUrl(getNextOnboardingPage({ role: profile.role, onboardingStep: profile.onboarding_step ?? 0 })),
        { replace: true }
      );
      return;
    }

    navigate(createPageUrl(getRoleDashboardPage(profile.role)), { replace: true });
  }, [loading, profileLoading, user, profile, navigate]);

  return (
    <AuthLayout
      title="Signing you in…"
      subtitle="Please wait while we securely complete your session."
    >
      <div className="text-sm text-slate-600">
        {error ? (
          <p className="text-red-600">Could not complete sign-in: {String(error.message || error)}</p>
        ) : profile?.__error ? (
          <p className="text-red-600">
            Signed in, but profile could not be loaded. Please complete Supabase database setup and RLS policies, then refresh.
          </p>
        ) : (
          <p>Loading your account…</p>
        )}
      </div>
    </AuthLayout>
  );
}

