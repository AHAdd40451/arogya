import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { exchangeCodeForSessionIfPresent } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";
import {
  getNextOnboardingPage,
  getRoleDashboardPage,
  getRoleOnboardingStartPage,
  setMyRoleIfUnset,
  updateMyProfile,
} from "@/services/profile";

const VALID_ROLES = /** @type {const} */ (["patient", "provider"]);

function isValidRole(role) {
  return VALID_ROLES.includes(role);
}

function safeGetIntendedRoleFromStorage() {
  try {
    const v = localStorage.getItem("arogya_intended_role");
    return isValidRole(v) ? v : null;
  } catch {
    return null;
  }
}

function safeClearIntendedRoleStorage() {
  try {
    localStorage.removeItem("arogya_intended_role");
  } catch {
    // ignore
  }
}

async function checkHasRow(table, userId) {
  const { data, error } = await supabase.from(table).select("user_id").eq("user_id", userId).limit(1);
  if (error) throw error;
  return Array.isArray(data) && data.length > 0;
}

async function inferRoleCandidate(user) {
  const fromMeta = user?.user_metadata?.intended_role;
  if (isValidRole(fromMeta)) return fromMeta;

  const fromStorage = safeGetIntendedRoleFromStorage();
  if (fromStorage) return fromStorage;

  if (!user?.id) return null;

  if (await checkHasRow("patients", user.id)) return "patient";
  if (await checkHasRow("providers", user.id)) return "provider";
  return null;
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, profile, loading, profileLoading, refreshProfile } = useAuth();
  const [error, setError] = React.useState(null);
  const [roleResolutionError, setRoleResolutionError] = React.useState("");
  const [resolvingRole, setResolvingRole] = React.useState(false);
  const attemptedAutoResolveRef = React.useRef(false);

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

    if (!profile.role) return;

    if (!profile.onboarding_completed_at) {
      navigate(
        createPageUrl(getNextOnboardingPage({ role: profile.role, onboardingStep: profile.onboarding_step ?? 0 })),
        { replace: true }
      );
      return;
    }

    navigate(createPageUrl(getRoleDashboardPage(profile.role)), { replace: true });
  }, [loading, profileLoading, user, profile, navigate]);

  React.useEffect(() => {
    if (loading || profileLoading) return;
    if (!user) return;
    if (!profile || profile?.__error) return;
    if (profile.role) return;
    if (attemptedAutoResolveRef.current) return;

    attemptedAutoResolveRef.current = true;
    setRoleResolutionError("");
    setResolvingRole(true);

    inferRoleCandidate(user)
      .then(async (candidate) => {
        if (!candidate) return;
        await setMyRoleIfUnset(candidate);
        await updateMyProfile({ onboarding_step: 0 });
        safeClearIntendedRoleStorage();
        await refreshProfile();
        navigate(createPageUrl(getRoleOnboardingStartPage(candidate)), { replace: true });
      })
      .catch((e) => setRoleResolutionError(String(e.message || e)))
      .finally(() => setResolvingRole(false));
  }, [loading, profileLoading, user, profile, refreshProfile, navigate]);

  const chooseRoleInline = async (role) => {
    setRoleResolutionError("");
    setResolvingRole(true);
    try {
      await setMyRoleIfUnset(role);
      await updateMyProfile({ onboarding_step: 0 });
      safeClearIntendedRoleStorage();
      await refreshProfile();
      navigate(createPageUrl(getRoleOnboardingStartPage(role)), { replace: true });
    } catch (e) {
      setRoleResolutionError(String(e.message || e));
    } finally {
      setResolvingRole(false);
    }
  };

  return (
    <AuthLayout title="Signing you in..." subtitle="Please wait while we securely complete your session.">
      <div className="text-sm text-slate-600">
        {error ? (
          <p className="text-red-600">Could not complete sign-in: {String(error.message || error)}</p>
        ) : profile?.__error ? (
          <p className="text-red-600">
            Signed in, but profile could not be loaded. Please complete Supabase database setup and RLS policies, then
            refresh.
          </p>
        ) : profile && !profile.role ? (
          <div className="space-y-3">
            <p className="text-slate-600">{resolvingRole ? "Finishing account setup..." : "Choose your account type to continue."}</p>
            {roleResolutionError ? <p className="text-red-600">{roleResolutionError}</p> : null}
            <div className="grid grid-cols-1 gap-2">
              <Button
                disabled={resolvingRole}
                onClick={() => chooseRoleInline("patient")}
                className="rounded-xl py-5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60"
              >
                Continue as Patient
              </Button>
              <Button
                disabled={resolvingRole}
                onClick={() => chooseRoleInline("provider")}
                variant="outline"
                className="rounded-xl py-5 border-slate-200 disabled:opacity-60"
              >
                Continue as Provider
              </Button>
            </div>
            <p className="text-xs text-slate-400">
              This is only needed if your account was created before role onboarding was enabled.
            </p>
          </div>
        ) : (
          <p>Loading your account...</p>
        )}
      </div>
    </AuthLayout>
  );
}

