import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function MessageList({ messages, myUserId }) {
  const bottomRef = React.useRef(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-2">
        {messages.map((m) => {
          const mine = m.sender_user_id === myUserId;
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div className="max-w-[85%]">
                <div
                  className={cn(
                    "px-3.5 py-2.5 rounded-2xl text-sm border",
                    mine
                      ? "bg-[#2A7F7F] text-white border-[#2A7F7F]"
                      : "bg-white text-slate-900 border-slate-100"
                  )}
                >
                  {m.message_type === "file" ? (
                    <a
                      href={m.file_url ?? "#"}
                      className={cn("underline", mine ? "text-white" : "text-teal-700")}
                      target="_blank"
                      rel="noreferrer"
                    >
                      File
                    </a>
                  ) : (
                    m.message
                  )}
                </div>
                <div className={cn("mt-1 flex items-center gap-1.5", mine ? "justify-end" : "justify-start")}>
                  <span className="text-[11px] text-slate-400">{formatTime(m.created_at)}</span>
                  {mine && m.seen ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
                      <CheckCheck className="w-3.5 h-3.5" />
                      Seen
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

