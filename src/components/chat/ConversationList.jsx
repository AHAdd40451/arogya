import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

function formatTimestamp(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getDisplayName(profile) {
  if (!profile) return "Unknown";
  return profile.full_name || profile.email || "Unknown";
}

function AvatarCircle({ name, size = "md" }) {
  const initial = String(name || "?").trim().slice(0, 1).toUpperCase();
  const colors = [
    "bg-teal-100 text-teal-700",
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  // Pick a stable color based on first char code
  const colorClass = colors[(initial.charCodeAt(0) ?? 0) % colors.length];
  const sizeClass = size === "md" ? "w-11 h-11 text-base" : "w-9 h-9 text-sm";

  return (
    <div className={cn("rounded-full flex items-center justify-center shrink-0 font-bold", sizeClass, colorClass)}>
      {initial}
    </div>
  );
}

export default function ConversationList({
  conversations,
  selectedId,
  myUserId,
  onSelect,
  roleLabel, // "provider" or "patient" — the role of the OTHER person
}) {
  const count = conversations.length;
  const otherRoleLabel = roleLabel === "provider" ? "Provider" : "Patient";

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#2A7F7F]" strokeWidth={1.75} />
            <p className="text-sm font-semibold text-slate-900">Messages</p>
          </div>
          {count > 0 && (
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1 ml-6">
          {count === 0
            ? `No ${otherRoleLabel.toLowerCase()} conversations yet`
            : `${count} ${otherRoleLabel.toLowerCase()} conversation${count !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="px-3 py-2 space-y-1" style={{ maxWidth: "59%" }}>
          {conversations.map((c) => {
            const other     = c.provider_user_id === myUserId ? c.patient : c.provider;
            const otherRole = c.provider_user_id === myUserId ? "Patient" : "Provider";
            const name      = getDisplayName(other);
            const isSelected = c.id === selectedId;
            const hasMessage = Boolean(c.last_message);

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(c.id)}
                className={cn(
                  "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                  isSelected
                    ? "bg-teal-50 border-l-[3px] border-l-teal-500"
                    : "hover:bg-slate-50",
                )}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <AvatarCircle name={name} />
                  {/* Role dot */}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold",
                      otherRole === "Provider"
                        ? "bg-teal-500 text-white"
                        : "bg-blue-500 text-white",
                    )}
                    title={otherRole}
                  >
                    {otherRole[0]}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className={cn("text-sm truncate", isSelected ? "font-semibold text-[#1F2937]" : "font-medium text-slate-800")}>
                        {name}
                      </p>
                      <Badge
                        className={cn(
                          "text-[9px] px-1 py-0 h-4 shrink-0 font-medium",
                          otherRole === "Provider"
                            ? "bg-teal-50 text-teal-700 border-teal-200"
                            : "bg-blue-50 text-blue-700 border-blue-200",
                        )}
                        variant="outline"
                      >
                        {otherRole}
                      </Badge>
                    </div>
                    {c.last_message_at && (
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatTimestamp(c.last_message_at)}
                      </span>
                    )}
                  </div>
                  <p className={cn("text-xs truncate leading-relaxed", hasMessage ? "text-slate-500" : "text-slate-400 italic")}>
                    {c.last_message || "No messages yet"}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Empty state */}
          {count === 0 && (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium text-slate-600">No conversations yet</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-[180px] mx-auto">
                Book an appointment to start chatting with a {otherRoleLabel.toLowerCase()}.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
