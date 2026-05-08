import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

function formatTimestamp(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function getDisplayName(profile) {
  if (!profile) return "Unknown";
  return profile.full_name || profile.email || "Unknown";
}

export default function ConversationList({
  conversations,
  selectedId,
  myUserId,
  onSelect,
  roleLabel,
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-900">Messages</p>
        <p className="text-xs text-slate-500 mt-0.5">Your {roleLabel} conversations</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.map((c) => {
            const other = c.provider_user_id === myUserId ? c.patient : c.provider;
            const name = getDisplayName(other);
            const initial = String(name || "?").trim().slice(0, 1).toUpperCase();
            const isSelected = c.id === selectedId;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(c.id)}
                className={cn(
                  "w-full text-left flex items-start gap-3 px-3 py-3 rounded-xl border transition-colors",
                  isSelected
                    ? "bg-teal-50 border-teal-200"
                    : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-100"
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-[#2A7F7F]/10 flex items-center justify-center shrink-0">
                  <span className="text-[#2A7F7F] font-bold">{initial}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
                    <span className="text-[11px] text-slate-400 shrink-0">{formatTimestamp(c.last_message_at)}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{c.last_message || "No messages yet"}</p>
                </div>
              </button>
            );
          })}

          {conversations.length === 0 ? (
            <div className="px-3 py-10 text-center">
              <p className="text-sm text-slate-500">No conversations yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Once you have a linked provider/patient, your chat will appear here.
              </p>
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
}

