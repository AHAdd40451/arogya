import { supabase } from "@/lib/supabaseClient";

export async function listBookableProviders({ service = null, onlyOnline = false } = {}) {
  const { data, error } = await supabase.rpc("list_bookable_providers", {
    p_service: service,
    p_only_online: onlyOnline,
  });
  if (error) throw error;
  return data ?? [];
}

export async function listProviderBookedTimes(providerUserId, windowStart, windowEnd) {
  const { data, error } = await supabase.rpc("list_provider_booked_times", {
    p_provider_user_id: providerUserId,
    p_window_start: windowStart instanceof Date ? windowStart.toISOString() : windowStart,
    p_window_end:   windowEnd   instanceof Date ? windowEnd.toISOString()   : windowEnd,
  });
  if (error) throw error;
  return data ?? [];
}

export async function bookAppointment({ providerUserId, startsAt, concern }) {
  const { data, error } = await supabase.rpc("book_appointment", {
    p_provider_user_id: providerUserId,
    p_starts_at: startsAt instanceof Date ? startsAt.toISOString() : startsAt,
    p_concern: concern ?? null,
  });
  if (error) throw error;
  return data;
}

/** @param {string} providerUserId @param {string} patientUserId */
export async function listConversationAppointments(providerUserId, patientUserId) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("provider_user_id", providerUserId)
    .eq("patient_user_id", patientUserId)
    .order("starts_at", { ascending: true })
    .limit(10);
  if (error) throw error;
  return data ?? [];
}

export async function listMyAppointments({ role, from, to, status } = {}) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const uid = userData.user?.id;
  if (!uid) throw new Error("Not authenticated");

  let query = supabase.from("appointments").select("*");

  if (role === "provider") {
    query = query.eq("provider_user_id", uid);
  } else {
    query = query.eq("patient_user_id", uid);
  }

  if (from) query = query.gte("starts_at", from instanceof Date ? from.toISOString() : from);
  if (to)   query = query.lte("starts_at", to   instanceof Date ? to.toISOString()   : to);

  if (status) {
    if (Array.isArray(status)) {
      query = query.in("status", status);
    } else {
      query = query.eq("status", status);
    }
  }

  query = query.order("starts_at", { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
