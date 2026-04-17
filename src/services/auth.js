import { supabase, getPublicSiteUrl } from "@/lib/supabaseClient";

function getRedirectUrl(pathname) {
  const base = getPublicSiteUrl();
  return new URL(pathname, base).toString();
}

export function getAuthCallbackUrl() {
  return getRedirectUrl("/AuthCallback");
}

export async function signUpWithEmail({ email, password, roleHint }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: roleHint ? { intended_role: roleHint } : undefined,
      emailRedirectTo: getAuthCallbackUrl(),
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: getAuthCallbackUrl() },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function requestPasswordReset({ email }) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getRedirectUrl("/ResetPassword"),
  });
  if (error) throw error;
}

export async function exchangeCodeForSessionIfPresent() {
  const url = new URL(window.location.href);
  if (!url.searchParams.get("code")) return null;
  const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
  if (error) throw error;
  return data;
}

export async function updatePassword({ password }) {
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return data;
}

export function getReadableAuthErrorMessage(error) {
  if (!error) return "Something went wrong.";
  const message = typeof error.message === "string" ? error.message : String(error);
  // Common Supabase phrasing tweaks for nicer UI copy.
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "Invalid email or password.";
  }
  if (message.toLowerCase().includes("email not confirmed")) {
    return "Please confirm your email before logging in.";
  }
  return message;
}

