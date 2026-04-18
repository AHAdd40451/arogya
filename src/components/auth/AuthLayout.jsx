import React from "react";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col font-inter">
      {/* <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <Link to={createPageUrl("Home")} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2A7F7F] flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-white" strokeWidth={2} />
          </div>
          <span className="font-bold text-[#1F2937] text-base tracking-tight">Arogya</span>
        </Link>
      </div> */}

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-8">
            <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-1.5">{title}</h1>
            {subtitle ? (
              <p className="text-sm text-slate-500 mb-5 sm:mb-6 leading-relaxed">{subtitle}</p>
            ) : null}
            <div className="space-y-4">{children}</div>
            {footer ? <div className="mt-6">{footer}</div> : null}
          </div>
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
