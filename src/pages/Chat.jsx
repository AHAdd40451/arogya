import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import ConversationList from "@/components/chat/ConversationList";
import MessageComposer from "@/components/chat/MessageComposer";
import MessageList from "@/components/chat/MessageList";
import ThreadHeader from "@/components/chat/ThreadHeader";
import ChatEmptyState from "@/components/chat/ChatEmptyState";
import { useChatConversations } from "@/hooks/useChatConversations";
import { useChatMessages } from "@/hooks/useChatMessages";
import { getOrCreateConversation } from "@/services/chat";

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

export default function Chat() {
  const { user, profile } = useAuth();
  const userId = user?.id ?? null;
  const roleLabel = profile?.role === "provider" ? "patient" : "provider";

  const { conversations, loading: convLoading, error: convError, refresh: refreshConversations, setConversations } =
    useChatConversations({ userId, enabled: Boolean(userId) });

  const [selectedId, setSelectedId] = React.useState(null);

  React.useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId]);

  React.useEffect(() => {
    if (!userId || !profile?.role) return;

    const params = new URLSearchParams(window.location.search);
    const otherId = params.get("with");
    if (!otherId) return;

    if (!isUuid(otherId)) {
      toast({
        variant: "destructive",
        title: "Invalid user id",
        description: "The 'with' query param must be a UUID.",
      });
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    const run = async () => {
      try {
        const payload =
          profile.role === "provider"
            ? { providerUserId: userId, patientUserId: otherId }
            : { providerUserId: otherId, patientUserId: userId };

        const convo = await getOrCreateConversation(payload);
        setConversations((prev) => {
          const exists = prev.some((c) => c.id === convo.id);
          return exists ? prev : [convo, ...prev];
        });
        setSelectedId(convo.id);
      } catch (e) {
        toast({
          variant: "destructive",
          title: "Could not start chat",
          description: String(e?.message || e),
        });
      } finally {
        window.history.replaceState({}, "", window.location.pathname);
      }
    };

    run();
  }, [profile?.role, setConversations, userId]);

  const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null;

  const { messages, loading: msgLoading, error: msgError, send } = useChatMessages({
    conversationId: selectedConversation?.id ?? null,
    userId,
    enabled: Boolean(userId && selectedConversation?.id),
  });

  React.useEffect(() => {
    if (convError) {
      toast({
        variant: "destructive",
        title: "Could not load conversations",
        description: String(convError.message || convError),
      });
    }
  }, [convError]);

  React.useEffect(() => {
    if (msgError) {
      toast({
        variant: "destructive",
        title: "Could not load messages",
        description: String(msgError.message || msgError),
      });
    }
  }, [msgError]);

  if (!userId) {
    return <ChatEmptyState title="Sign in required" description="Please sign in to access secure chat." />;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-4 sm:gap-6">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation?.id ?? null}
            myUserId={userId}
            onSelect={(id) => setSelectedId(id)}
            roleLabel={roleLabel}
          />

          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden min-h-[520px] flex flex-col">
            {!selectedConversation ? (
              <ChatEmptyState
                title={convLoading ? "Loading chats..." : "Select a conversation"}
                description="Choose a conversation on the left to start messaging."
              />
            ) : (
              <>
                <ThreadHeader conversation={selectedConversation} myUserId={userId} />
                <div className="flex-1 flex flex-col">
                  {msgLoading ? (
                    <div className="flex-1 flex items-center justify-center text-sm text-slate-500">Loading messages...</div>
                  ) : (
                    <MessageList messages={messages} myUserId={userId} />
                  )}
                </div>
                <MessageComposer
                  disabled={!selectedConversation || msgLoading}
                  onSend={async (text) => {
                    try {
                      await send(text);
                      refreshConversations();
                    } catch (e) {
                      toast({
                        variant: "destructive",
                        title: "Message failed",
                        description: String(e?.message || e),
                      });
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

