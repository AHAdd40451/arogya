import React from "react";
import { MessageSquare } from "lucide-react";

export default function ChatEmptyState({ title, description }) {
  return (
    <div className="h-full flex items-center justify-center px-6">
      <div className="max-w-sm w-full bg-white border border-slate-100 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-6 h-6 text-teal-700" strokeWidth={1.5} />
        </div>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 mt-1.5">{description}</p>
      </div>
    </div>
  );
}

