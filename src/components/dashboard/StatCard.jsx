import React from "react";

export default function StatCard({ label, value, icon: Icon, color = "teal", trend }) {
  const colorMap = {
    teal: "bg-teal-50 text-[#2A7F7F]",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:border-slate-200 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-[#1F2937] mt-1.5">{value}</p>
          {trend && <p className="text-xs text-emerald-600 font-medium mt-1">{trend}</p>}
        </div>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg ${colorMap[color]} flex items-center justify-center`}>
            <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  );
}