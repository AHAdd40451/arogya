import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { fetchConversationMessages, markConversationSeen, sendTextMessage } from "@/services/chat";

const PAGE_SIZE = 10;

export function useChatMessages({ conversationId, userId, enabled = true } = {}) {
  const [messages, setMessages]       = React.useState([]);
  const [loading, setLoading]         = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore]         = React.useState(false);
  const [error, setError]             = React.useState(null);

  const messageIdSetRef = React.useRef(new Set());

  const reset = React.useCallback(() => {
    setMessages([]);
    setHasMore(false);
    messageIdSetRef.current = new Set();
  }, []);

  const refresh = React.useCallback(async () => {
    if (!enabled || !conversationId) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch the last PAGE_SIZE messages (newest PAGE_SIZE)
      const data = await fetchConversationMessages({ conversationId, limit: PAGE_SIZE });
      setMessages(data);
      setHasMore(data.length >= PAGE_SIZE);
      messageIdSetRef.current = new Set(data.map((m) => m.id));
      if (userId) await markConversationSeen({ conversationId });
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

  // Real-time subscription
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
            try { await markConversationSeen({ conversationId }); } catch { /* ignore */ }
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => upsertMessage(payload.new),
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, enabled, userId]);

  /** Load PAGE_SIZE messages older than the current oldest visible message. */
  const loadMore = React.useCallback(async () => {
    if (!conversationId || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const oldest = messages[0];
      const data = await fetchConversationMessages({
        conversationId,
        limit: PAGE_SIZE,
        before: oldest?.created_at,
      });
      setHasMore(data.length >= PAGE_SIZE);
      const fresh = data.filter((m) => !messageIdSetRef.current.has(m.id));
      fresh.forEach((m) => messageIdSetRef.current.add(m.id));
      if (fresh.length > 0) {
        setMessages((prev) => [...fresh, ...prev]);
      }
    } catch { /* ignore transient errors */ }
    finally { setLoadingMore(false); }
  }, [conversationId, hasMore, loadingMore, messages]);

  const send = React.useCallback(async (text) => {
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
  }, [conversationId]);

  return { messages, loading, loadingMore, hasMore, error, refresh, send, loadMore };
}
