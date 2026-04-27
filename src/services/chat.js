import { supabase } from "@/lib/supabaseClient";

const CONVERSATION_SELECT = `
  id,
  provider_user_id,
  patient_user_id,
  status,
  last_message,
  last_message_at,
  created_at,
  updated_at,
  provider:profiles!conversations_provider_user_fk(user_id, full_name, email, role),
  patient:profiles!conversations_patient_user_fk(user_id, full_name, email, role)
`;

const MESSAGE_SELECT = `
  id,
  conversation_id,
  sender_user_id,
  message_type,
  message,
  file_url,
  seen,
  seen_at,
  seen_by_user_id,
  created_at
`;

async function requireUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Not authenticated.");
  return data.user;
}

export async function listMyConversations() {
  const user = await requireUser();

  const { data, error } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .or(`provider_user_id.eq.${user.id},patient_user_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getOrCreateConversation({ providerUserId, patientUserId }) {
  const { data: existing, error: existingError } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .eq("provider_user_id", providerUserId)
    .eq("patient_user_id", patientUserId)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) return existing;

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      provider_user_id: providerUserId,
      patient_user_id: patientUserId,
      status: "active",
    })
    .select(CONVERSATION_SELECT)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchConversationMessages({ conversationId, limit = 200 }) {
  const { data, error } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function sendTextMessage({ conversationId, text }) {
  const user = await requireUser();

  const trimmed = String(text ?? "").trim();
  if (!trimmed) return null;

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_user_id: user.id,
      message_type: "text",
      message: trimmed,
    })
    .select(MESSAGE_SELECT)
    .single();

  if (error) throw error;
  return data;
}

export async function markConversationSeen({ conversationId }) {
  const user = await requireUser();
  const seenAt = new Date().toISOString();

  const { error } = await supabase
    .from("messages")
    .update({ seen: true, seen_at: seenAt, seen_by_user_id: user.id })
    .eq("conversation_id", conversationId)
    .neq("sender_user_id", user.id)
    .eq("seen", false);

  if (error) throw error;
}

