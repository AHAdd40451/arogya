import { supabase } from "@/lib/supabaseClient";

export const USER_ROLES = /** @type {const} */ ({
  patient: "patient",
  provider: "provider",
});

export function getRoleDashboardPage(role) {
  if (role === USER_ROLES.provider) return "ProviderDashboard";
  return "PatientDashboard";
}

export function getRoleOnboardingStartPage(role) {
  if (role === USER_ROLES.provider) return "ProviderOnboarding1";
  return "PatientOnboarding1";
}

export function getNextOnboardingPage({ role, onboardingStep }) {
  const step = Number(onboardingStep ?? 0);
  if (role === USER_ROLES.provider) {
    const pages = [
      "ProviderOnboarding1",
      "ProviderOnboarding2",
      "ProviderOnboarding3",
      "ProviderOnboarding4",
      "ProviderOnboarding5",
    ];
    return pages[Math.min(step, pages.length - 1)];
  }

  const pages = [
    "PatientOnboarding1",
    "PatientOnboarding2",
    "PatientOnboarding3",
    "PatientOnboarding4",
  ];
  return pages[Math.min(step, pages.length - 1)];
}

export async function fetchMyProfile() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateMyProfile(patch) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error("Not authenticated.");

  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("user_id", userData.user.id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function setMyRoleIfUnset(role) {
  // RLS + DB trigger should prevent role changes after it's set.
  const current = await fetchMyProfile();
  if (current?.role) return current;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error("Not authenticated.");

  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("user_id", userData.user.id)
    .is("role", null)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function upsertPatientProfile(patientPatch) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error("Not authenticated.");

  const payload = { user_id: userData.user.id, ...patientPatch };
  const { data, error } = await supabase
    .from("patients")
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function upsertProviderProfile(providerPatch) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error("Not authenticated.");

  const payload = { user_id: userData.user.id, ...providerPatch };
  const { data, error } = await supabase
    .from("providers")
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function markOnboardingStepCompleted({ step, completedAt }) {
  const patch = {
    onboarding_step: step,
    ...(completedAt ? { onboarding_completed_at: completedAt } : null),
  };
  return updateMyProfile(patch);
}
