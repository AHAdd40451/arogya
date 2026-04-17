import React from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { USER_ROLES, getRoleOnboardingStartPage, setMyRoleIfUnset, updateMyProfile } from "@/services/profile";

export default function ChooseRole() {
  const navigate = useNavigate();
  const { user, profile, loading, profileLoading, refreshProfile } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const intendedRole = user?.user_metadata?.intended_role;

  React.useEffect(() => {
    if (loading || profileLoading) return;
    if (!user) navigate(createPageUrl("Login"), { replace: true });
    if (profile?.role) navigate(createPageUrl(getRoleOnboardingStartPage(profile.role)), { replace: true });
  }, [loading, profileLoading, user, profile, navigate]);

  const choose = async (role) => {
    setError("");
    setSubmitting(true);
    try {
      await setMyRoleIfUnset(role);
      await updateMyProfile({ onboarding_step: 0 });
      await refreshProfile();
      navigate(createPageUrl(getRoleOnboardingStartPage(role)), { replace: true });
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Choose your account type"
      subtitle="This determines your onboarding flow and dashboard. You can’t change it later."
    >
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid grid-cols-1 gap-3">
        <Button
          onClick={() => choose(USER_ROLES.patient)}
          disabled={submitting}
          className={`rounded-xl py-5 ${
            intendedRole === USER_ROLES.patient ? "bg-[#2A7F7F] hover:bg-[#236969]" : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          Continue as Patient
        </Button>
        <Button
          onClick={() => choose(USER_ROLES.provider)}
          disabled={submitting}
          variant="outline"
          className="rounded-xl py-5 border-slate-200"
        >
          Continue as Provider
        </Button>
      </div>
    </AuthLayout>
  );
}

