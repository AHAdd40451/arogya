import React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MessageComposer({ disabled, onSend }) {
  const [text, setText] = React.useState("");

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    await onSend(trimmed);
  };

  return (
    <div className="p-3 border-t border-slate-100 bg-white">
      <div className="flex items-center gap-2">
        <Input
          value={text}
          disabled={disabled}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Type a message..."
          className="h-11 rounded-xl"
        />
        <Button
          type="button"
          disabled={disabled || !text.trim()}
          onClick={submit}
          className="h-11 rounded-xl bg-[#2A7F7F] hover:bg-[#236969] px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      {/* <p className="text-[11px] text-slate-400 mt-2">
        Messages are encrypted in transit and protected by Supabase row-level security.
      </p> */}
    </div>
  );
}

