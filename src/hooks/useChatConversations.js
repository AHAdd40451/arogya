import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { listMyConversations } from "@/services/chat";

function sortConversations(list) {
  return [...list].sort((a, b) => {
    const aLast = a.last_message_at ? Date.parse(a.last_message_at) : 0;
    const bLast = b.last_message_at ? Date.parse(b.last_message_at) : 0;
    if (aLast !== bLast) return bLast - aLast;

    const aUpd = a.updated_at ? Date.parse(a.updated_at) : 0;
    const bUpd = b.updated_at ? Date.parse(b.updated_at) : 0;
    if (aUpd !== bUpd) return bUpd - aUpd;

    const aCreate = a.created_at ? Date.parse(a.created_at) : 0;
    const bCreate = b.created_at ? Date.parse(b.created_at) : 0;
    return bCreate - aCreate;
  });
}

export function useChatConversations({ userId, enabled = true } = {}) {
  const [conversations, setConversations] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const refresh = React.useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listMyConversations();
      setConversations(sortConversations(data));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  React.useEffect(() => {
    if (!enabled || !userId) return;

    const upsertConversation = (row) => {
      setConversations((prev) => {
        const next = prev.some((c) => c.id === row.id)
          ? prev.map((c) => (c.id === row.id ? { ...c, ...row } : c))
          : [row, ...prev];
        return sortConversations(next);
      });
    };

    const removeConversation = (id) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
    };

    const channel = supabase
      .channel(`chat:conversations:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations", filter: `provider_user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === "DELETE") removeConversation(payload.old?.id);
          else {
            upsertConversation(payload.new);
            if (payload.eventType === "INSERT") refresh();
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations", filter: `patient_user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === "DELETE") removeConversation(payload.old?.id);
          else {
            upsertConversation(payload.new);
            if (payload.eventType === "INSERT") refresh();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, refresh, userId]);

  return { conversations, loading, error, refresh, setConversations };
}
