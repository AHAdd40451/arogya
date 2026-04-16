import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardCard({ title, icon: Icon, children, className = "", action }) {
  return (
    <Card className={`border-slate-100 shadow-none hover:border-slate-200 transition-colors ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5 px-5">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="w-7 h-7 rounded-lg bg-[#F7F9FB] border border-slate-100 flex items-center justify-center">
              <Icon className="w-3.5 h-3.5 text-[#2A7F7F]" strokeWidth={1.5} />
            </div>
          )}
          <CardTitle className="text-sm font-semibold text-[#1F2937]">{title}</CardTitle>
        </div>
        {action}
      </CardHeader>
      <CardContent className="px-5 pb-5">{children}</CardContent>
    </Card>
  );
}