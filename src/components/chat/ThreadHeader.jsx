import React from "react";
import { ShieldCheck } from "lucide-react";

function getDisplayName(profile) {
  if (!profile) return "Unknown";
  return profile.full_name || profile.email || "Unknown";
}

export default function ThreadHeader({ conversation, myUserId }) {
  const other = conversation?.provider_user_id === myUserId ? conversation?.patient : conversation?.provider;
  const name = getDisplayName(other);
  const initial = String(name || "?").trim().slice(0, 1).toUpperCase();

  return (
    <div className="px-4 py-3 border-b border-slate-100 bg-white flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#2A7F7F]/10 flex items-center justify-center shrink-0">
          <span className="text-[#2A7F7F] font-bold">{initial}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
          <p className="text-xs text-slate-500 truncate">Secure provider-patient chat</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg shrink-0">
        <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
        Protected
      </div>
    </div>
  );
}

