import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { fetchConversationMessages, markConversationSeen, sendTextMessage } from "@/services/chat";

export function useChatMessages({ conversationId, userId, enabled = true } = {}) {
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const messageIdSetRef = React.useRef(new Set());

  const reset = React.useCallback(() => {
    setMessages([]);
    messageIdSetRef.current = new Set();
  }, []);

  const refresh = React.useCallback(async () => {
    if (!enabled || !conversationId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchConversationMessages({ conversationId });
      setMessages(data);
      messageIdSetRef.current = new Set(data.map((m) => m.id));
      if (userId) {
        await markConversationSeen({ conversationId });
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [conversationId, enabled, userId]);

  React.useEffect(() => {
    reset();
    refresh();
  }, [reset, refresh]);

  React.useEffect(() => {
    if (!enabled || !conversationId) return;

    const upsertMessage = (row) => {
      setMessages((prev) => {
        if (messageIdSetRef.current.has(row.id)) {
          return prev.map((m) => (m.id === row.id ? { ...m, ...row } : m));
        }
        messageIdSetRef.current.add(row.id);
        return [...prev, row];
      });
    };

    const channel = supabase
      .channel(`chat:messages:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        async (payload) => {
          const row = payload.new;
          upsertMessage(row);
          if (userId && row?.sender_user_id && row.sender_user_id !== userId) {
            try {
              await markConversationSeen({ conversationId });
            } catch {
              // ignore transient errors; next refresh will reconcile
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => upsertMessage(payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, enabled, userId]);

  const send = React.useCallback(
    async (text) => {
      if (!conversationId) return null;
      const inserted = await sendTextMessage({ conversationId, text });
      if (inserted?.id) {
        setMessages((prev) => {
          if (messageIdSetRef.current.has(inserted.id)) return prev;
          messageIdSetRef.current.add(inserted.id);
          return [...prev, inserted];
        });
      }
      return inserted;
    },
    [conversationId]
  );

  return { messages, loading, error, refresh, send };
}

