import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConversationList from "@/components/chat/ConversationList";
import MessageComposer from "@/components/chat/MessageComposer";
import MessageList from "@/components/chat/MessageList";
import ThreadHeader from "@/components/chat/ThreadHeader";
import ChatEmptyState from "@/components/chat/ChatEmptyState";
import { useChatConversations } from "@/hooks/useChatConversations";
import { useChatMessages } from "@/hooks/useChatMessages";
import { getOrCreateConversation } from "@/services/chat";
import { listConversationAppointments } from "@/services/booking";
import { format, differenceInMinutes, isAfter } from "date-fns";
import { Calendar, Video, Clock, ChevronDown, ChevronUp } from "lucide-react";

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

/** Pick the most relevant appointment to surface in the card. */
function pickRelevant(appts) {
  if (!appts.length) return null;
  const now = new Date();
  // in_progress beats everything
  const live = appts.find((a) => a.status === "in_progress");
  if (live) return live;
  // soonest upcoming scheduled
  const upcoming = appts
    .filter((a) => a.status === "scheduled" && isAfter(new Date(a.starts_at), now))
    .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));
  if (upcoming.length) return upcoming[0];
  // fall back to most recent
  return appts[appts.length - 1] ?? null;
}

const STATUS_STYLES = {
  scheduled:   "bg-blue-100 text-blue-700",
  in_progress: "bg-emerald-100 text-emerald-700",
  completed:   "bg-slate-100 text-slate-600",
  canceled:    "bg-red-100 text-red-600",
};

const JOIN_THRESHOLD_MINUTES = 15;

function BookingCard({ appointment, myUserId }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);

  if (!appointment) return null;

  const startsAt    = new Date(appointment.starts_at);
  const endsAt      = new Date(appointment.ends_at);
  const now         = new Date();
  const isLive      = appointment.status === "in_progress";
  const canJoin     = isLive || (
    appointment.status === "scheduled" &&
    differenceInMinutes(startsAt, now) <= JOIN_THRESHOLD_MINUTES &&
    isAfter(endsAt, now)
  );

  const formatRange = () => {
    try {
      return `${format(startsAt, "MMM d 'at' h:mm a")} – ${format(endsAt, "h:mm a")}`;
    } catch {
      return "—";
    }
  };

  const concern     = appointment.concern ? appointment.concern.replace(/_/g, " ") : "General";
  const otherName   = myUserId === appointment.patient_user_id
    ? appointment.provider_name
    : appointment.patient_name;

  const handleJoin = () => {
    navigate(
      createPageUrl("VirtualVisit") +
      `?provider=${encodeURIComponent(appointment.provider_name)}&credentials=NP`,
    );
  };

  return (
    <div className={`border-b border-slate-100 bg-teal-50/60 transition-all ${collapsed ? "py-2 px-4" : "px-4 py-3"}`}>
      {/* Collapsed bar */}
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          className="w-full flex items-center justify-between text-xs text-teal-700 font-medium"
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {appointment.status === "in_progress" ? "Visit in progress" : `Appointment · ${format(startsAt, "MMM d, h:mm a")}`}
          </span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-800">Appointment</span>
              <Badge className={`text-[10px] px-1.5 py-0 capitalize ${STATUS_STYLES[appointment.status] ?? "bg-slate-100 text-slate-600"}`}>
                {appointment.status.replace("_", " ")}
              </Badge>
            </div>
            <button onClick={() => setCollapsed(true)} className="text-slate-400 hover:text-slate-600 shrink-0">
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatRange()}
            </span>
            <span className="flex items-center gap-1.5 capitalize">
              <Video className="w-3.5 h-3.5 text-slate-400" />
              {appointment.mode} · {concern}
            </span>
            <span className="text-slate-500 sm:col-span-2">
              With <span className="font-medium text-slate-700">{otherName}</span>
            </span>
          </div>

          {canJoin && (
            <Button
              onClick={handleJoin}
              size="sm"
              className="mt-3 bg-[#2A7F7F] hover:bg-[#236969] text-white rounded-xl text-xs h-8 px-4"
            >
              <Video className="w-3.5 h-3.5 mr-1.5" />
              {isLive ? "Join Live Visit" : "Join Video Call"}
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default function Chat() {
  const { user, profile } = useAuth();
  const userId = user?.id ?? null;
  const roleLabel = profile?.role === "provider" ? "patient" : "provider";

  const { conversations, loading: convLoading, error: convError, refresh: refreshConversations, setConversations } =
    useChatConversations({ userId, enabled: Boolean(userId) });

  const [selectedId, setSelectedId] = React.useState(null);

  // Booking card state
  const [appts, setAppts]           = React.useState([]);

  React.useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId]);

  // Load appointments whenever the selected conversation changes
  React.useEffect(() => {
    const convo = conversations.find((c) => c.id === selectedId) ?? null;
    if (!convo) { setAppts([]); return; }

    listConversationAppointments(convo.provider_user_id, convo.patient_user_id)
      .then(setAppts)
      .catch(() => setAppts([]));
  }, [selectedId, conversations]);

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
  const activeAppointment    = pickRelevant(appts);

  const { messages, loading: msgLoading, loadingMore, hasMore, error: msgError, send, loadMore } = useChatMessages({
    conversationId: selectedConversation?.id ?? null,
    userId,
    enabled: Boolean(userId && selectedConversation?.id),
  });

  React.useEffect(() => {
    if (convError) {
      toast({ variant: "destructive", title: "Could not load conversations", description: String(convError.message || convError) });
    }
  }, [convError]);

  React.useEffect(() => {
    if (msgError) {
      toast({ variant: "destructive", title: "Could not load messages", description: String(msgError.message || msgError) });
    }
  }, [msgError]);

  if (!userId) {
    return <ChatEmptyState title="Sign in required" description="Please sign in to access secure chat." />;
  }

  return (
    <div className="bg-[#F7F9FB]" style={{ height: "calc(100vh - 72px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-4 h-full flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-4 sm:gap-6 flex-1 min-h-0">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation?.id ?? null}
            myUserId={userId}
            onSelect={(id) => setSelectedId(id)}
            roleLabel={roleLabel}
          />

          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col h-full min-h-0">
            {!selectedConversation ? (
              <ChatEmptyState
                title={convLoading ? "Loading chats..." : "Select a conversation"}
                description="Choose a conversation on the left to start messaging."
              />
            ) : (
              <>
                <ThreadHeader conversation={selectedConversation} myUserId={userId} />

                {/* Booking card — shown when there is an appointment for this conversation */}
                <BookingCard appointment={activeAppointment} myUserId={userId} />

                <div className="flex-1 flex flex-col min-h-0">
                  {msgLoading ? (
                    <div className="flex-1 flex items-center justify-center text-sm text-slate-500">Loading messages...</div>
                  ) : (
                    <MessageList
                    messages={messages}
                    myUserId={userId}
                    onLoadMore={loadMore}
                    loadingMore={loadingMore}
                    hasMore={hasMore}
                  />
                  )}
                </div>
                <MessageComposer
                  disabled={!selectedConversation || msgLoading}
                  onSend={async (text) => {
                    try {
                      await send(text);
                      refreshConversations();
                    } catch (e) {
                      toast({ variant: "destructive", title: "Message failed", description: String(e?.message || e) });
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
